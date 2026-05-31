import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Tools</h3>
          <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><Link href="/merge">Merge PDF</Link></li>
            <li><Link href="/split">Split PDF</Link></li>
            <li><Link href="/rotate">Rotate PDF</Link></li>
            <li><Link href="/jpg-to-pdf">JPG to PDF</Link></li>
            <li><Link href="/pdf-to-jpg">PDF to JPG</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Portfolio</h3>
          <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><a href="https://kalkfin.com">kalkfin</a></li>
            <li><a href="https://kalkmate.com">kalkmate</a></li>
            <li><a href="https://vitamath.io">vitamath</a></li>
            <li><a href="https://unitcrate.com">unitcrate</a></li>
            <li><a href="https://wordfox.io">wordfox</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-tech">Privacy-Tech</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} JM Workshop — pdfnest.io
      </div>
    </footer>
  );
}
