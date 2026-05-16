import { useEffect } from "react";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

/**
 * Register all fonts to React PDF so it can render fonts correctly in PDF
 */
export const useRegisterReactPDFFont = () => {
  useEffect(() => {
    const registerFonts = async () => {
      const { Font } = await import("@react-pdf/renderer");
      const allFontFamilies = getAllFontFamiliesToLoad();
      allFontFamilies.forEach((fontFamily) => {
        Font.register({
          family: fontFamily,
          fonts: [
            {
              src: `fonts/${fontFamily}-Regular.ttf`,
            },
            {
              src: `fonts/${fontFamily}-Bold.ttf`,
              fontWeight: "bold",
            },
          ],
        });
      });
    };
    registerFonts();
  }, []);
};

export const useRegisterReactPDFHyphenationCallback = (fontFamily: string) => {
  useEffect(() => {
    const registerHyphenation = async () => {
      const { Font } = await import("@react-pdf/renderer");
      if (ENGLISH_FONT_FAMILIES.includes(fontFamily as any)) {
        Font.registerHyphenationCallback((word) => [word]);
      } else {
        Font.registerHyphenationCallback((word) =>
          word
            .split("")
            .map((char) => [char, ""])
            .flat()
        );
      }
    };
    registerHyphenation();
  }, [fontFamily]);
};
