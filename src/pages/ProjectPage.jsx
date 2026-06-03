import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { CONTENT_TYPES, contentItemsAPI } from "../api/contentItems";

const catalogVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const catalogFragmentShader = `
  uniform float progress;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform vec4 resolution;
  varying vec2 vUv;

  void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec2 p = newUV;
    float x = progress;
    x = smoothstep(0.0, 1.0, (x * 2.0 + p.y - 1.0));
    vec4 color = mix(
      texture2D(texture1, (p - 0.5) * (1.0 - x) + 0.5),
      texture2D(texture2, (p - 0.5) * x + 0.5),
      x
    );

    float vignette = smoothstep(0.98, 0.18, length(vUv - vec2(0.5)));
    gl_FragColor = vec4(color.rgb * (0.55 + vignette * 0.45), 1.0);
  }
`;

const FALLBACK_POSTS = [
  {
    id: "massage-guide",
    title: "Как выбрать массаж под свое состояние",
    slug: "massage-guide",
    subtitle: "Короткий гид по расслабляющим, восстановительным и глубоким техникам.",
    body:
      "Выбор массажа зависит от цели: снять стресс, восстановиться после нагрузки, расслабить спину или просто перезагрузиться. Перед записью важно учитывать чувствительность тела, привычный уровень нагрузки и желаемую интенсивность.",
    imageUrl: "https://images.pexels.com/photos/37718775/pexels-photo-37718775.jpeg",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "aftercare",
    title: "Что делать после массажа",
    slug: "aftercare",
    subtitle: "Простые правила, чтобы эффект процедуры держался дольше.",
    body:
      "После массажа лучше пить воду, избегать тяжелых тренировок и дать телу время на восстановление. Небольшая сонливость или ощущение мягкости в мышцах - нормальная часть процесса.",
    imageUrl: "https://images.pexels.com/photos/21371133/pexels-photo-21371133.jpeg",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "salon-ritual",
    title: "Почему атмосфера салона важна",
    slug: "salon-ritual",
    subtitle: "Свет, тишина и темп процедуры влияют на качество расслабления.",
    body:
      "Хорошая процедура начинается до первого прикосновения. Спокойная обстановка помогает нервной системе переключиться, а мастеру - работать точнее и мягче.",
    imageUrl: "https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg",
    sortOrder: 2,
    isActive: true,
  },
];

function getPostYear(post) {
  const rawDate = post.updatedAt || post.createdAt;
  if (!rawDate) return "2026";
  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? "2026" : String(date.getFullYear());
}

function normalizeSlides(posts) {
  const activePosts = posts.filter((post) => post?.isActive !== false && post?.imageUrl);
  const slugCounts = activePosts.reduce((counts, post) => {
    const slug = String(post.slug || "").trim();
    if (slug) counts.set(slug, (counts.get(slug) || 0) + 1);
    return counts;
  }, new Map());

  return activePosts.map((post, index) => {
    const slug = String(post.slug || "").trim();
    const hasDuplicateSlug = slug && slugCounts.get(slug) > 1;
    const pathSource = hasDuplicateSlug ? post.id : slug || post.id || post.title;

    return {
      ...post,
      title: post.title || `Blog Entry ${index + 1}`,
      subtitle: post.subtitle || "Massage journal",
      body: post.body || post.subtitle || "Материал из блога массажного салона.",
      preview: post.subtitle || "Материал из блога массажного салона.",
      imageUrl: post.imageUrl,
      articlePath: encodeURIComponent(pathSource || `post-${index + 1}`),
      type: "Blog",
      field: post.subtitle || "Massage journal",
      date: getPostYear(post),
    };
  });
}

export function getBlogPostPath(post) {
  return post.articlePath || encodeURIComponent(post.slug || post.id || post.title);
}

export { FALLBACK_POSTS, getPostYear, normalizeSlides };

export default function ProjectPage() {
  const [posts, setPosts] = useState(FALLBACK_POSTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentHidden, setContentHidden] = useState(true);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const activeIndexRef = useRef(0);
  const transitioningRef = useRef(false);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const texturesRef = useRef([]);
  const rafRef = useRef(null);

  const slides = useMemo(() => normalizeSlides(posts), [posts]);
  const activeSlide = slides[activeIndex] || slides[0];

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const data = await contentItemsAPI.getPublic(CONTENT_TYPES.blog);
        const activePosts = data.filter((item) => item.isActive && item.imageUrl);
        if (isMounted && activePosts.length > 0) {
          setPosts(activePosts);
          setActiveIndex(0);
          activeIndexRef.current = 0;
        }
      } catch (error) {
        console.warn("Blog DB content unavailable, using fallback posts.", error);
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setContentHidden(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || slides.length === 0) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.001, 1000);
    camera.position.set(0, 0, 2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        progress: { value: 0 },
        texture1: { value: null },
        texture2: { value: null },
        resolution: { value: new THREE.Vector4(1, 1, 1, 1) },
      },
      vertexShader: catalogVertexShader,
      fragmentShader: catalogFragmentShader,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    function updateResolution() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;

      const texture = material.uniforms.texture1.value || texturesRef.current[0];
      const image = texture?.image;
      const imageAspect = image?.width ? image.height / image.width : 1;

      let a1;
      let a2;
      if (height / width > imageAspect) {
        a1 = (width / height) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = height / width / imageAspect;
      }

      material.uniforms.resolution.value.set(width, height, a1, a2);

      const distance = camera.position.z;
      camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * distance));
      plane.scale.x = camera.aspect;
      plane.scale.y = 1;
      camera.updateProjectionMatrix();
    }

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    Promise.all(
      slides.map(
        (slide) =>
          new Promise((resolve) => {
            loader.load(
              slide.imageUrl,
              (texture) => {
                texture.minFilter = texture.magFilter = THREE.LinearFilter;
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve(texture);
              },
              undefined,
              () => resolve(null),
            );
          }),
      ),
    ).then((textures) => {
      texturesRef.current = textures.filter(Boolean);
      if (texturesRef.current.length === 0) return;

      material.uniforms.texture1.value = texturesRef.current[0];
      material.uniforms.texture2.value =
        texturesRef.current[1 % texturesRef.current.length];
      updateResolution();
    });

    function render() {
      rafRef.current = requestAnimationFrame(render);
      if (material.uniforms.texture1.value) {
        renderer.render(scene, camera);
      }
    }

    render();
    updateResolution();
    window.addEventListener("resize", updateResolution);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", updateResolution);
      texturesRef.current.forEach((texture) => texture.dispose());
      texturesRef.current = [];
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      materialRef.current = null;
    };
  }, [slides]);

  const handleNext = useCallback(
    (event) => {
      if (event.target.closest("a")) return;
      if (transitioningRef.current || slides.length < 2) return;

      const textures = texturesRef.current;
      const material = materialRef.current;
      const nextIndex = (activeIndexRef.current + 1) % slides.length;

      transitioningRef.current = true;
      setContentHidden(true);

      if (material && textures.length > 0) {
        material.uniforms.texture1.value = textures[activeIndexRef.current % textures.length];
        material.uniforms.texture2.value = textures[nextIndex % textures.length];
        material.uniforms.progress.value = 0;

        gsap.to(material.uniforms.progress, {
          value: 1,
          duration: 1.35,
          ease: "power2.out",
          onComplete: () => {
            material.uniforms.texture1.value = textures[nextIndex % textures.length];
            material.uniforms.progress.value = 0;
          },
        });
      }

      window.setTimeout(() => {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setContentHidden(false);
        transitioningRef.current = false;
      }, 420);
    },
    [slides.length],
  );

  if (!activeSlide) return null;

  return (
    <section className="catalog-blog" ref={containerRef} onClick={handleNext}>
      <canvas className="catalog-blog-canvas" ref={canvasRef} />

      <div className={`catalog-blog-content${contentHidden ? " is-hidden" : ""}`} ref={contentRef}>
        <div className="container">
          <div className="catalog-blog-title">
            <h1>{activeSlide.title}</h1>
          </div>

          <div className="catalog-blog-description">
            <p>{activeSlide.preview}</p>

            <div className="catalog-blog-info">
              <p className="type-mono">Type. {activeSlide.type}</p>
              <p className="type-mono">Field. {activeSlide.field}</p>
              <p className="type-mono">Date. {activeSlide.date}</p>
            </div>

            <a className="type-mono" href={`/project/${getBlogPostPath(activeSlide)}`}>
              [ Read Article ]
            </a>
          </div>
        </div>
      </div>

      <div className="catalog-blog-footer">
        <div className="container">
          <p className="type-mono">Selected Blog</p>
          <p className="type-mono">
            [ {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")} Click Through ]
          </p>
        </div>
      </div>
    </section>
  );
}
