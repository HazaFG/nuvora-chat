"use client"
export default function VideoPlayer(props: any) {
  const src = `data:video/mp4;base64,${props.src}`
  return (
    <video width="320" height="240" controls preload="none">
      <source src={src} type="video/mp4" />
    </video>
  )
}

