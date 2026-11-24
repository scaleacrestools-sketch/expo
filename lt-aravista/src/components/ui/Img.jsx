/**
 * Responsive, layout-stable image. Pass an image record from config/images.js
 * ({ src, srcSet?, width, height }) plus `sizes`. Lazy by default.
 */
export default function Img({ image, alt, sizes = '100vw', priority = false, className = '', ...rest }) {
  const img = typeof image === 'string' ? { src: image } : image;
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes : undefined}
      width={img.width}
      height={img.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      {...rest}
    />
  );
}
