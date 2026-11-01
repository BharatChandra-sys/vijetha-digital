import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Vijetha Digital` : "Vijetha Digital – Premium Print Platform";
  }, [title]);
}
