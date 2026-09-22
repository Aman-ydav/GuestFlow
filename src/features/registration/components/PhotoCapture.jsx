import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { FiCamera, FiRefreshCw, FiUpload, FiAlertCircle, FiVideo } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Mandatory photo capture for visitor registration (see requirements.md §I).
 * Camera access is only requested after an explicit "Start Camera" click —
 * never automatically on mount, so opening the kiosk tab doesn't itself
 * trigger a permission prompt. Falls back to a file upload if the camera is
 * denied/unavailable, with a clear message either way.
 */
export function PhotoCapture({ value, onChange, error }) {
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraState, setCameraState] = useState('idle') // idle | starting | live | denied | unsupported

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  useEffect(() => stopStream, [stopStream]) // release the camera on unmount only

  // The <video> only mounts once cameraState becomes 'live' (it's behind that
  // conditional below), so videoRef.current is still null at the point
  // startCamera() resolves — assigning srcObject there was a no-op and the
  // stream never reached any <video> element. Attaching it here, in an effect
  // keyed on cameraState, runs after React has actually mounted the element.
  useEffect(() => {
    if (cameraState === 'live' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraState])

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
    setCameraState('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = stream
      setCameraState('live')
    } catch {
      setCameraState('denied')
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    // The stream is attached but hasn't decoded a first frame yet — capturing
    // now would draw a blank 0x0 canvas. Extremely rare after the ref-timing
    // fix above (by the time a user sees the live feed and clicks, there's
    // always a frame), but worth a clear message instead of a silently blank photo.
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error('Camera is still starting up — wait a moment and try again.')
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    onChange(canvas.toDataURL('image/jpeg', 0.85))
    stopStream()
    setCameraState('idle')
  }

  const retake = () => {
    onChange(null)
    setCameraState('idle')
  }

  const onFileSelected = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex aspect-4/3 w-full max-w-xs items-center justify-center overflow-hidden rounded-md border bg-muted',
          error ? 'border-destructive' : 'border-input'
        )}
      >
        {value ? (
          <img src={value} alt="Captured visitor" className="h-full w-full object-cover" />
        ) : cameraState === 'live' ? (
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        ) : cameraState === 'denied' || cameraState === 'unsupported' ? (
          <div className="flex flex-col items-center gap-1 p-4 text-center text-muted-foreground">
            <FiAlertCircle className="size-6" />
            <p className="text-xs">
              {cameraState === 'denied' ? 'Camera access denied.' : 'Camera not available.'} Upload a photo instead.
            </p>
          </div>
        ) : cameraState === 'starting' ? (
          <p className="text-xs text-muted-foreground">Requesting camera access…</p>
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-4 text-center text-muted-foreground">
            <FiVideo className="size-6" />
            <p className="text-xs">Camera is off. Start it when you're ready.</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {value ? (
          <Button type="button" variant="outline" size="sm" onClick={retake}>
            <FiRefreshCw className="size-3.5" /> Retake
          </Button>
        ) : cameraState === 'live' ? (
          <Button type="button" size="sm" onClick={capture}>
            <FiCamera className="size-3.5" /> Capture Photo
          </Button>
        ) : cameraState === 'idle' ? (
          <Button type="button" size="sm" onClick={startCamera}>
            <FiVideo className="size-3.5" /> Start Camera
          </Button>
        ) : null}
        {/* Upload is a fallback for when the camera genuinely can't be used
            (denied/unsupported) — not a parallel shortcut around it. A kiosk's
            mandatory photo exists to verify who actually showed up; letting
            someone upload an arbitrary file whenever a working camera is
            sitting right there would defeat that. */}
        {!value && (cameraState === 'denied' || cameraState === 'unsupported') && (
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <FiUpload className="size-3.5" /> Upload instead
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelected} />
          </>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
