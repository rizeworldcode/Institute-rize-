import Reveal from "../components/Reveal";

export default function PrivacyPolicy() {
  return (
    <main className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl p-8 md:p-12 shadow-sm">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-neutral-900 mb-8 pb-8 border-b border-neutral-200">
              Privacy Policy
            </h1>
            
            <div className="prose prose-neutral max-w-none space-y-6 text-neutral-600 leading-relaxed">
              <p>At RizeWorld Institute, the privacy of our visitors is of extreme importance to us.</p>
              
              <p>This privacy policy document outlines the types of personal information is received and collected by RizeWorld and how it is used.</p>

              <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Log Files</h2>
              <p>Like many other Web sites, RizeWorld makes use of log files.</p>
              <p>The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user's movement around the site, and gather demographic information. IP addresses, and other such information are not linked to any information that is personally identifiable.</p>

              <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">Cookies and Web Beacons</h2>
              <p>RizeWorld does use cookies to store information about visitors preferences, record user-specific information on which pages the user access or visit, customize Web page content based on visitors browser type or other information that the visitor sends via their browser.</p>

              <h2 className="text-2xl font-bold text-neutral-900 mt-10 mb-4">DoubleClick DART Cookie</h2>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Google, as a third party vendor, uses cookies to serve ads on RizeWorld.</li>
                <li>Google's use of the DART cookie enables it to serve ads to users based on their visit to RizeWorld and other sites on the Internet.</li>
                <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at the following URL – <a href="https://www.google.com/policies/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.google.com/policies/privacy/</a>.</li>
              </ul>

              <p>These third-party ad servers or ad networks use technology to the advertisements and links that appear on RizeWorld send directly to your browsers. They automatically receive your IP address when this occurs.</p>
              
              <p>Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by the third-party ad networks to measure the effectiveness of their advertisements and / or to personalize the advertising content that you see.</p>
              
              <p>RizeWorld has no access to or control over these cookies that are used by third-party advertisers.</p>
              
              <p>You should consult the respective privacy policies of these third-party ad servers for more detailed information on their practices as well as for instructions about how to opt-out of certain practices. RizeWorld's privacy policy does not apply to, and we cannot control the activities of, such other advertisers or web sites. If you wish to disable cookies, you may do so through your individual browser options.</p>
              
              <p>More detailed information about cookie management with specific web browsers can be found at the browser's respective websites.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
