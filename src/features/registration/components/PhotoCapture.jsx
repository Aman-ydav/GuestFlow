import { useCallback, useEffect, useRef, useState } from 'react'
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

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported')
      return
    }
    setCameraState('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraState('live')
    } catch {
      setCameraState('denied')
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video) return
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
        {!value && cameraState !== 'starting' && (
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
