import { useEffect, useState } from "react";
import { validateHttpsLink } from "./utils/check-valid-url";
import { Spinner } from "./components/Spinner";
import { Footer } from "./components/Footer";

function App() {
  const [url, setUrl] = useState("");
  const [isValidLink, setIsValidLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (validateHttpsLink(url)) setIsValidLink(true);
    else setIsValidLink(false);
  }, [url]);

  async function handleClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://corsproxy.io/?" + encodeURIComponent(url)
      );
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const fileName = getFileNameFromUrl(url);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setUrl("");
      setError(undefined);
    } catch (error) {
      console.log(error);
      setError("Ooops, something went wrong...");
    } finally {
      setIsLoading(false);
    }
  }
  function getFileNameFromUrl(fileUrl: string): string {
    return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#6d0239] to-[#15162c]">
        <div className="container flex flex-grow flex-col items-center gap-8 px-4 py-16 ">
          <h1 className="md:text-5xl text-4xl font-extrabold tracking-tight text-white ">
            🙏 Please <span className="text-[hsl(309,36%,62%)]">Download!</span>
          </h1>
          <form
            className="mt-5 w-full justify-center gap-3 sm:flex"
            onSubmit={handleClick}
          >
            <div className="md:w-100 mb-3 w-full sm:mb-0  md:max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  className="h-12 w-full items-center space-x-3 rounded-lg border border-gray-300 bg-white px-4 text-left text-slate-600 shadow-sm  ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-[hsl(125,50%,56%)]"
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="File URL "
                />
              </div>
            </div>
            <div className="w-full sm:w-auto md:w-40">
              <button
                type="submit"
                disabled={!isValidLink}
                className="flex h-12 w-full items-center justify-center rounded-md disabled:bg-pink-900 bg-pink-600 px-4 py-2 font-medium text-white shadow-sm focus:outline-none focus:ring-2  focus:ring-pink-500 focus:ring-offset-2 enabled:hover:bg-pink-700"
              >
                {isLoading && <Spinner />} Download
              </button>
            </div>
          </form>
          <div className="text-red-500">
            <p>{error}</p>
          </div>
          <p className="text-slate-200 max-w-3xl">
            Note: All data stays on your device and there are no requests send
            to my server. But: In order to make this app work with all URLs your
            device will make a request to{" "}
            <a
              className="text-[hsl(309,36%,62%)] hover:underline hover:decoration-dotted"
              href="https://corsproxy.io"
            >
              corsproxy.io
            </a>
            . They may log your requests.
          </p>
        </div>

        <Footer />
      </main>
    </>
  );
}

export default App;
