import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeCustom } from "lib/redux/types";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const { descriptions = [] } = custom || {};

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {(() => {
        const safeDescriptions = (descriptions || []).filter(
          (d) => typeof d === "string" && d.trim() !== ""
        );
        if (safeDescriptions.length === 0) return null;
        return (
          <View style={{ ...styles.flexCol }}>
            <ResumePDFBulletList
              items={safeDescriptions}
              showBulletPoints={showBulletPoints}
            />
          </View>
        );
      })()}
    </ResumePDFSection>
  );
};
