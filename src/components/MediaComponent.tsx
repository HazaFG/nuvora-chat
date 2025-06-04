import React from 'react';
interface Props {
  mimeType?: string;
  media?: string;
  text: string;
}

export function MediaComponent({ mimeType, media, text }: Props) {
  if (mimeType?.startsWith('image/') && media) {
    return (
      <div>
        <img src={media} alt="media" className="max-w-full rounded-lgl" />
        {text && <p>{text}</p>}
      </div>
    );
  }

  if (mimeType?.startsWith('video/') && media) {
    return (
      <div>
        <video controls className="max-w-full">
          <source src={media} type={mimeType} />
        </video>
        {text && <p>{text}</p>}
      </div>
    );
  }

  return <p>{text}</p>;
}
