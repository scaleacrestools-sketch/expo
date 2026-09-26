import { ArrowRight } from './Icons.jsx';

export default function BlogCard({ post }) {
  const { title, excerpt, image, position } = post;
  return (
    <article className="bcard">
      <a href="#blog" className="bcard__link">
        <div className="bcard__media">
          <img src={image} alt="" loading="lazy" style={{ objectPosition: position }} />
        </div>
        <h3 className="bcard__title">{title}</h3>
        <p className="bcard__excerpt">{excerpt}</p>
        <span className="bcard__cta">
          Read Article
          <ArrowRight width={16} height={16} />
        </span>
      </a>
    </article>
  );
}
