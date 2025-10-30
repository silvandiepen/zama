import React, { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon/Icon";
import { Colors, Size } from "@/types";
import { useBemm } from "@/utils/bemm";
import "./About.scss";
import { useTranslation } from "react-i18next";
import { Icons } from "open-icon";

export const About: React.FC = () => {
  const bemm = useBemm("about");
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tm = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = document.querySelectorAll("[data-animate]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.2 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Handle video autoplay
  useEffect(() => {
    const videos = document.querySelectorAll("video");

    const handleCanPlay = () => {
      videos.forEach((video) => {
        if (video.paused) {
          video.play().catch(() => {
            console.log("Autoplay prevented, waiting for user interaction");
          });
        }
      });
    };

    const handleClick = () => {
      videos.forEach((video) => {
        if (video.paused) {
          video.play().catch((error) => {
            console.log("Play failed:", error);
          });
        }
      });
    };

    // Try to play when videos are ready
    videos.forEach((video) => {
      video.addEventListener("canplay", handleCanPlay);
      // Fallback: try to play immediately
      if (video.readyState >= 2) {
        video.play().catch(() => {});
      }
    });

    // Enable autoplay on first user interaction
    document.addEventListener("click", handleClick, { once: true });
    document.addEventListener("touchstart", handleClick, { once: true });

    return () => {
      videos.forEach((video) => {
        video.removeEventListener("canplay", handleCanPlay);
      });
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    <div className={bemm("", { loaded })}>
      <div className={bemm("header")}>
        <div className={bemm("header-image")} data-animate="fade">
          <video
            className={bemm("header-video")}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/sil-hevc.mp4" type="video/mp4; codecs=hvc1" />
            <source src="/sil-vp9.webm" type="video/webm; codecs=vp9" />
          </video>
        </div>
        <div className={bemm("header-content")}>
          <div className={bemm("content-wrapper")} data-animate="fade-up">
            <h1>{t("about.aboutCreator")}</h1>
            <p>{t("about.intro1")}</p>
            <p>{t("about.intro2")}</p>
          </div>
        </div>
      </div>

      <section className={bemm("section", ["skills"])}>
        <div className={bemm("section-container")}>
          <h2>{t("about.skillsTitle")}</h2>
          <div className={bemm("skill")}>
            {[
              {
                title: t("about.frontend"),
                items: [
                  { key: "about.skill.reactTs", icon: Icons.CODE_BRACKETS },
                  { key: "about.skill.components", icon: Icons.FOLDER },
                  { key: "about.skill.vueNuxt", icon: Icons.CODE_BRACKETS },
                  { key: "about.skill.cssScss", icon: Icons.STAR_M },
                  {
                    key: "about.skill.state",
                    icon: Icons.BOARD_SPLIT4_VERTICAL,
                  },
                  { key: "about.skill.a11y", icon: Icons.ACCESSIBILITY_PERSON },
                ],
              },
              {
                title: t("about.backend"),
                items: [
                  { key: "about.skill.nodeExpress", icon: Icons.ROCKET },
                  { key: "about.skill.restGraphql", icon: Icons.CIRCLED },
                  {
                    key: "about.skill.dbDesign",
                    icon: Icons.BOARD_SPLIT31_HORIZONTAL,
                  },
                  { key: "about.skill.api", icon: Icons.ARROW_LEFT_RIGHT },
                  { key: "about.skill.cloud", icon: "cloud" },
                  { key: "about.skill.performance", icon: "trending-up" },
                ],
              },
              {
                title: t("about.design"),
                items: [
                  { key: "about.skill.uiux", icon: Icons.USERS },
                  { key: "about.skill.designSystems", icon: Icons.BOX },
                  { key: "about.skill.designTools", icon: Icons.FOLDER_CHECK },
                  { key: "about.skill.icons", icon: Icons.TURTLE },
                  { key: "about.skill.responsive", icon: Icons.TABLET },
                  { key: "about.skill.a11y", icon: Icons.ACCESSIBILITY_PERSON },
                ],
              },
            ].map((group, gi) => (
              <div key={gi} className={bemm("skill-group")} data-animate="pop">
                <h3 className={bemm("skill-title")}>{group.title}</h3>
                <ul className={bemm("skill-list")}>
                  {group.items.map((it, ii) => (
                    <li
                      className={bemm("skill-item")}
                      key={ii}
                      style={
                        {
                          "--i": ii,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        } as React.CSSProperties
                      }
                    >
                      <Icon className={bemm("skill-icon")} name={it.icon} />{" "}
                      {t(it.key)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={bemm("section", ["info"])}>
        <div className={bemm("section-container")}>
          <h2>{t("about.projectTitle")}</h2>
          <p>{t("about.projectDesc")}</p>
          <div className={bemm("features")}>
            {[
              {
                icon: "code",
                title: t("about.tech.react"),
                desc: t("about.tech.reactDesc"),
              },
              {
                icon: "document-text",
                title: t("about.tech.typescript"),
                desc: t("about.tech.typescriptDesc"),
              },
              {
                icon: "wrench",
                title: t("about.tech.vite"),
                desc: t("about.tech.viteDesc"),
              },
              {
                icon: "book",
                title: t("about.tech.i18n"),
                desc: t("about.tech.i18nDesc"),
              },
              {
                icon: "bar-chart",
                title: t("about.tech.charts"),
                desc: t("about.tech.chartsDesc"),
              },
              {
                icon: "users",
                title: t("about.tech.router"),
                desc: t("about.tech.routerDesc"),
              },
              {
                icon: "package",
                title: t("about.tech.eslint"),
                desc: t("about.tech.eslintDesc"),
              },
              {
                icon: "folder",
                title: t("about.tech.sass"),
                desc: t("about.tech.sassDesc"),
              },
              {
                icon: "collection",
                title: t("about.tech.icons"),
                desc: t("about.tech.iconsDesc"),
              },
              {
                icon: "collection",
                title: t("about.tech.bemm"),
                desc: t("about.tech.bemmDesc"),
              },
            ].map((f, i) => (
              <div key={i} className={bemm("feature-card")} data-animate="pop">
                <div className={bemm("feature-icon")}>
                  <Icon name={f.icon} />
                </div>
                <div className={bemm("feature-title")}>{f.title}</div>
                <div className={bemm("feature-desc")}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={bemm("content")}>
        <section className={bemm("section", ["family"])}>
          <div className={bemm("section-container")}>
            <div className={bemm("family")}>
              <div className={bemm("family-photo")} data-animate="reveal-l">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={bemm('family-video')}
                >
                  <source src="/family-hevc.mp4" type="video/mp4; codecs=hvc1" />
                  <source src="/family-vp9.webm" type="video/webm; codecs=vp9" />
                </video>
              </div>
              <div className={bemm("family-content")} data-animate="reveal-r">
                <h2>{t("about.familyTitle")}</h2>
                <p>{t("about.familyDesc1")}</p>
                <p>{t("about.familyDesc2")}</p>
                <p>{t("about.familyDesc3")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={bemm("section", ["get-in-touch", "success"])}>
          <div className={bemm("section-container")}>
            <h2>{t("about.contactTitle")}</h2>
            <p>{t("about.contactDesc")}</p>

            <div className={bemm("contacts")}>
              <Button
                size={Size.LARGE}
                onClick={() => window.open("https://www.sil.mt", "_blank")}
                className={bemm("contact-btn")}
                data-animate="pop"
                icon={Icons.ARROW_RIGHT}
                color={Colors.INFO}
              >
                {t("about.visitWebsite")}
              </Button>

              <Button
                size={Size.LARGE}
                onClick={() =>
                  window.open("https://github.com/silvandiepen/zama", "_blank")
                }
                className={bemm("contact-btn")}
                data-animate="pop"
                icon={"github"}
                color={Colors.DARK}
              >
                {t("about.github")}
              </Button>

              <Button
                size={Size.LARGE}
                onClick={() => window.open("mailto:me@sil.mt")}
                className={bemm("contact-btn")}
                data-animate="pop"
                icon={"mail"}
                color={Colors.SECONDARY}
              >
                {t("about.email")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
