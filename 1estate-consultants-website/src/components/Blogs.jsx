import { BLOGS } from '../data/content.js';
import BlogCard from './BlogCard.jsx';
import Button from './Button.jsx';
import Carousel from './Carousel.jsx';

export default function Blogs() {
  return (
    <section className="section blogs" id="blog" aria-labelledby="blog-title">
      <div className="container blogs__grid">
        <div className="blogs__intro" data-reveal>
          <p className="eyebrow eyebrow--gold">Official Blogs</p>
          <h2 className="blogs__title" id="blog-title">
            Stay Updated
            <br />
            with Our
            <br />
            <em>Latest Blogs</em>
          </h2>
          <p className="blogs__desc">Insights for smarter property decisions across Bangalore.</p>
          <Button href="#blog" variant="secondary">
            View All Insights
          </Button>
        </div>
        <div className="blogs__slider" data-reveal style={{ '--delay': '140ms' }}>
          <Carousel label="Latest blog posts" tone="dark">
            {BLOGS.map((b) => (
              <BlogCard key={b.title} post={b} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
