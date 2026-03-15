export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">~/about</h1>

      <div className="space-y-4 text-terminal-green-muted leading-relaxed">
        <p>
          Web developer, fashion designer, and musician based in Omaha.
        </p>
        <p>
          I've been playing drums in bands for over 10 years. Currently
          playing with Wedding, previously with Bokr Tov and Big Nope.
        </p>
        <p>
          Software developer at Talent Plus in Lincoln, working on
          internal tools, client-facing applications, and integrations.
        </p>
        <p>
          I studied fashion design and showed my debut collection at Omaha
          Fashion Week in 2018 under the label Indigomaha. I recently
          launched a new brand,{" "}
          <a
            href="https://itstrueblue.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-green hover:underline"
          >
            True Blue
          </a>
          .
        </p>
      </div>
    </div>
  );
}
