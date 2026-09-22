import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import jsQR from 'jsqr'
import { FiAlertCircle, FiCamera, FiLoader, FiLogIn, FiLogOut, FiRotateCcw, FiSearch, FiVideo } from 'react-icons/fi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AvatarInitials } from '@/components/AvatarInitials'
import { StatusBadge } from '@/components/StatusBadge'
import { visitorSelectors, transitionVisitor, selectIsVisitorMutating } from '@/features/registration/visitorsSlice'
import { hostSelectors } from '@/features/approval/hostsSlice'

// A scanned visitor in one of these statuses has no valid check-in/out move
// right now — explain why instead of just disabling both buttons silently.
const NO_ACTION_MESSAGE = {
  pending: "This visitor hasn't been approved yet — approve their request first.",
  rejected: "This visitor's request was rejected — they shouldn't be checked in.",
  'checked-out': 'This visitor has already checked out.',
}

/**
 * Scans a visitor badge QR (see VisitorBadgeDialog — the code is just the
 * visitor's own id) with the device camera and offers Check-In/Check-Out
 * directly, instead of front desk having to search the table manually.
 * Scoped to walk-in visitor badges only, not the pre-approval invite e-pass —
 * an invite's QR encodes an invite code, not a visitor id, and what
 * "checking in an invite" should actually do (create a new visitor record?
 * transition the invite itself?) hasn't been decided yet, see DECISIONS.md.
 *
 * Same explicit-permission pattern as PhotoCapture: the camera never opens
 * until "Start Scanning" is clicked.
 */
export function QrCheckInScanner({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Scan Visitor Badge</DialogTitle>
          <DialogDescription>Point the camera at a visitor's QR badge to check them in or out.</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, keyed fresh each time, instead of resetting
            local state via an effect on close — unmounting naturally releases
            the camera (see the cleanup effect below) and the next mount starts
            with clean idle state, no synchronous setState-in-effect needed. */}
        {open && <ScannerBody />}
      </DialogContent>
    </Dialog>
  )
}

function ScannerBody() {
  const dispatch = useDispatch()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const frameRef = useRef(null)
  const lastScanAtRef = useRef(0)
  const [cameraState, setCameraState] = useState('idle') // idle | starting | live | denied | unsupported
  const [scannedCode, setScannedCode] = useState(null)

  const visitor = useSelector((s) => (scannedCode ? visitorSelectors.selectById(s, scannedCode) : null))
  const host = useSelector((s) => (visitor ? hostSelectors.selectById(s, visitor.hostId) : null))
  const mutating = useSelector((s) => (visitor ? selectIsVisitorMutating(s, visitor.id) : false))

  const stopStream = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  useEffect(() => stopStream, [stopStream]) // release the camera on unmount (dialog close)

  const scanFrame = useCallback(function scan(time) {
    const video = videoRef.current
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      frameRef.current = requestAnimationFrame(scan)
      return
    }
    // Throttled to ~5 decode attempts/sec — jsQR on every one of 60fps frames
    // is wasted CPU for a code that isn't moving fast.
    if (time - lastScanAtRef.current > 200) {
      lastScanAtRef.current = time
      const width = 320
      const height = Math.round((video.videoHeight / video.videoWidth) * width) || 240
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, width, height)
      const code = jsQR(ctx.getImageData(0, 0, width, height).data, width, height)
      if (code?.data) {
        setScannedCode(code.data)
        return // stop the loop — a result is showing, resumed explicitly via "Scan Another"
      }
    }
    frameRef.current = requestAnimationFrame(scan)
  }, [])

  // Same ref-timing fix as PhotoCapture: <video> only mounts once cameraState
  // is 'live', so the stream has to be attached after that, in an effect —
  // not at the point getUserMedia() resolves, when the ref is still null.
  useEffect(() => {
    if (cameraState === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      lastScanAtRef.current = 0
      frameRef.current = requestAnimationFrame(scanFrame)
    }
  }, [cameraState, scanFrame])

  const startScanning = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
    setCameraState('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraState('live')
    } catch {
      setCameraState('denied')
    }
  }

  const scanAnother = () => {
    setScannedCode(null)
    lastScanAtRef.current = 0
    if (cameraState === 'live') frameRef.current = requestAnimationFrame(scanFrame)
  }

  const act = async (to, verb) => {
    try {
      await dispatch(transitionVisitor({ id: visitor.id, to })).unwrap()
      toast.success(`${visitor.name} ${verb}`)
      setTimeout(scanAnother, 1200) // brief confirmation, then ready for the next person in line
    } catch (message) {
      toast.error(message || `Could not ${verb.replace('ed', '')} ${visitor.name}`)
    }
  }

  const canCheckIn = visitor?.status === 'approved'
  const canCheckOut = visitor?.status === 'checked-in'

  if (scannedCode) {
    return (
      <div className="space-y-4 py-2">
        {visitor ? (
          <>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <AvatarInitials name={visitor.name} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{visitor.name}</p>
                <p className="truncate text-xs text-muted-foreground">Visiting {host?.name ?? '—'}</p>
              </div>
              <StatusBadge status={visitor.status} />
            </div>

            {NO_ACTION_MESSAGE[visitor.status] && (
              <p className="flex items-start gap-2 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                <FiAlertCircle className="mt-0.5 size-3.5 shrink-0" /> {NO_ACTION_MESSAGE[visitor.status]}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="button" className="flex-1" disabled={!canCheckIn || mutating} onClick={() => act('checked-in', 'checked in')}>
                {mutating && canCheckIn ? <FiLoader className="size-4 animate-spin" /> : <FiLogIn className="size-4" />}
                Check-In
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={!canCheckOut || mutating}
                onClick={() => act('checked-out', 'checked out')}
              >
                {mutating && canCheckOut ? <FiLoader className="size-4 animate-spin" /> : <FiLogOut className="size-4" />}
                Check-Out
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
            <FiSearch className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">No visitor found for this code</p>
            <p className="text-xs text-muted-foreground">This QR doesn't match anyone in the system — try searching the table instead.</p>
          </div>
        )}
        <Button type="button" variant="ghost" className="w-full" onClick={scanAnother}>
          <FiRotateCcw className="size-3.5" /> Scan Another
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2 py-2">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md border border-input bg-muted">
        {cameraState === 'live' ? (
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        ) : cameraState === 'denied' || cameraState === 'unsupported' ? (
          <div className="flex flex-col items-center gap-1 p-4 text-center text-muted-foreground">
            <FiAlertCircle className="size-6" />
            <p className="text-xs">
              {cameraState === 'denied' ? 'Camera access denied.' : 'Camera not available.'} Search the table instead.
            </p>
          </div>
        ) : cameraState === 'starting' ? (
          <p className="text-xs text-muted-foreground">Requesting camera access…</p>
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-4 text-center text-muted-foreground">
            <FiCamera className="size-6" />
            <p className="text-xs">Camera is off. Start it to scan a badge.</p>
          </div>
        )}
      </div>
      {cameraState === 'idle' && (
        <Button type="button" size="sm" className="w-full" onClick={startScanning}>
          <FiVideo className="size-3.5" /> Start Scanning
        </Button>
      )}
    </div>
  )
}
