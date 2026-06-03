import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { CONTENT_TYPES, contentItemsAPI, parseArticleBody } from "../api/contentItems";
import { FALLBACK_POSTS, getBlogPostPath, getPostYear, normalizeSlides } from "./ProjectPage";

function findPost(posts, slug) {
  const decodedSlug = decodeURIComponent(slug || "");
  const encodedSlug = encodeURIComponent(decodedSlug);

  return posts.find((post) => {
    return (
      getBlogPostPath(post) === encodedSlug ||
      post.slug === decodedSlug ||
      String(post.id) === decodedSlug ||
      post.title === decodedSlug
    );
  });
}

export default function ProjectArticlePage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState(FALLBACK_POSTS);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const data = await contentItemsAPI.getPublic(CONTENT_TYPES.blog);
        const activePosts = data.filter((item) => item.isActive && item.imageUrl);
        if (isMounted && activePosts.length > 0) {
          setPosts(activePosts);
        }
      } catch (error) {
        console.warn("Blog article DB content unavailable, using fallback posts.", error);
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const slides = useMemo(() => normalizeSlides(posts), [posts]);
  const post = findPost(slides, slug) || slides[0];
  const postIndex = Math.max(0, slides.findIndex((item) => item.id === post?.id));
  const nextPost = slides[(postIndex + 1) % Math.max(slides.length, 1)];

  if (!post) return null;

  const articleBody = parseArticleBody(post.body);
  const articleImages = [post.imageUrl, ...articleBody.images].filter(Boolean);

  return (
    <>
      <section className="brief-hero blog-brief-hero">
        <div className="brief-hero-header">
          <p className="type-mono">Massage Journal</p>
          <h2>{post.title}</h2>
        </div>
      </section>

      <section className="brief-banner-img">
        <div className="brief-banner-img-wrapper">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      </section>

      <section className="brief-overview">
        <div className="brief-overview-header">
          <div className="container">
            <h2>{post.subtitle || post.title}</h2>
            <p className="type-mono">{getPostYear(post)}</p>
          </div>
        </div>

        <div className="brief-overview-content">
          <div className="container">
            <div className="brief-overview-content-col">
              <p className="type-mono">Article Brief</p>
            </div>
            <div className="brief-overview-content-col">
              <h5>{articleBody.text || post.body}</h5>
              <Link className="type-mono" to="/project">
                [ Back To Blog ]
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="brief-images">
        <div className="brief-images-container">
          <div className="container">
            {articleImages.map((imageUrl, index) => (
              <div className="brief-img" key={`${imageUrl}-${index}`}>
                <img
                  src={imageUrl}
                  alt={index === 0 ? post.title : `${post.title} ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {nextPost && (
        <section className="next-brief">
          <Link className="next-brief-header" to={`/project/${getBlogPostPath(nextPost)}`}>
            <p className="type-mono">Next Article</p>
            <h2>{nextPost.title}</h2>
          </Link>
        </section>
      )}

      <Footer />
    </>
  );
}
