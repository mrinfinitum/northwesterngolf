import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pastModelGroups } from "@/lib/product-content/past-models";
import { metadataTitle, openGraphBase } from "@/lib/seo";
import "./past-models.css";

const description =
  "A look back at discontinued Northwestern Golf models: Thunderbird full sets, Talon SS full sets, and Thunderbird drivers, fairways, hybrids, irons and wedges.";

export const metadata: Metadata = {
  title: metadataTitle("Past Models"),
  description,
  alternates: { canonical: "/pages/past-models" },
  openGraph: { ...openGraphBase, description, title: "Past Models · Northwestern Golf", url: "/pages/past-models" },
};

export default function PastModelsPage() {
  return (
    <div className="pm">
      <header className="pm-header">
        <p className="pm-eyebrow">Northwestern Golf archive</p>
        <h1 className="pm-title">Past Models</h1>
        <p className="pm-intro">
          The Thunderbird and Talon SS lines are no longer sold. They’re here for reference; today’s line-up is the John Daly
          Signature Sets.
        </p>
        <Link className="pm-button" href="/collections/all">Shop current sets</Link>
      </header>

      {pastModelGroups.map((group) => (
        <section aria-labelledby={`pm-${group.id}`} className="pm-group" id={group.id} key={group.id}>
          <div className="pm-group__head">
            <h2 className="pm-group__title" id={`pm-${group.id}`}>{group.heading}</h2>
            <p className="pm-group__intro">{group.intro}</p>
          </div>
          <ul className="pm-grid">
            {group.models.map((model) => (
              <li className="pm-card" id={model.handle} key={model.handle}>
                <div className="pm-card__media">
                  <Image
                    alt={model.title}
                    className="pm-card__image"
                    height={model.image.height}
                    sizes="(max-width: 699px) calc(50vw - 24px), (max-width: 1199px) calc(33vw - 32px), 300px"
                    src={model.image.src}
                    width={model.image.width}
                  />
                  <span className="pm-card__badge">Discontinued</span>
                </div>
                <p className="pm-card__title">{model.title}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
