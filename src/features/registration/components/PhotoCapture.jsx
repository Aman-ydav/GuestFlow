import { useCallback, useEffect, useRef, useState } from 'react'
import { FiCamera, FiRefreshCw, FiUpload, FiAlertCircle } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Mandatory photo capture for visitor registration (see requirements.md §I).
 * Live webcam preview -> canvas snapshot -> data URL. Falls back to a file
 * upload if the camera is denied/unavailable, with a clear message either way.
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

  const startCamera = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    // Starting the webcam is exactly "synchronize with an external system" — the
    // canonical useEffect use case — but getUserMedia is inherently async and must
    // report its outcome (live/denied/unsupported) back via state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!value) startCamera()
    return () => stopStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    onChange(canvas.toDataURL('image/jpeg', 0.85))
    stopStream()
  }

  const retake = () => {
    onChange(null)
    startCamera()
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
        ) : (
          <p className="text-xs text-muted-foreground">Starting camera…</p>
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
        ) : null}
        {!value && (
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
