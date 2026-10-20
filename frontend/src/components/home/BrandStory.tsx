import { img } from "../../data/images";
import { ButtonLink } from "../ui/Button";
import { SafeImage } from "../ui/SafeImage";
import { Section } from "../ui/Section";

export function BrandStory() {
  return (
    <Section className="bg-surface">
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20">
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <SafeImage src={img.story} alt="A hand-finished ceramic object in soft light" className="aspect-[3/4] w-full object-cover lg:aspect-[2/3]" />
        </div>
        <div className="max-w-lg">
          <h2 className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">Chosen slowly, so it can last.</h2>
          <p className="mt-7 text-lg leading-[1.8] text-muted">
            AURELLE brings together makers we trust across many disciplines. Every object is selected for its materials, its construction and how well it ages.
          </p>
          <p className="mt-5 text-lg leading-[1.8] text-muted">
            The result is a small, considered collection of things you will use for years and never feel the need to replace.
          </p>
          <ButtonLink to="/about" variant="outline" className="mt-10">Read our story</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
