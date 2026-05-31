import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About pdfnest",
  description: "About pdfnest — privacy-first PDF tools built by JM Workshop.",
  alternates: { canonical: "https://pdfnest.io/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">About pdfnest</h1>
      <p className="mt-4 text-neutral-700 dark:text-neutral-300">
        pdfnest is part of <strong>JM Workshop&apos;s</strong> utility-site portfolio — small, fast, ad-light single-purpose tools built to do one thing well and respect your time and data.
      </p>
      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        Sister sites:{" "}
        <a className="underline" href="https://kalkfin.com">kalkfin</a> (finance calculators),{" "}
        <a className="underline" href="https://kalkmate.com">kalkmate</a> (general math),{" "}
        <a className="underline" href="https://vitamath.io">vitamath</a> (health calculators),{" "}
        <a className="underline" href="https://unitcrate.com">unitcrate</a> (unit converters),{" "}
        <a className="underline" href="https://wordfox.io">wordfox</a> (word tools).
      </p>
    </div>
  );
}
