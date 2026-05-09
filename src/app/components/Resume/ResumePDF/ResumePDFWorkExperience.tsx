import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
  themeColor: string;
}) => {
  const safeExperiences = (workExperiences || []).filter(Boolean);

  const experienceViews: React.ReactNode[] = safeExperiences.map(
    ({ company, jobTitle, date, descriptions, hideBullets }, idx) => {
      const hideCompanyName =
        idx > 0 && company === safeExperiences[idx - 1]?.company;

      const companyViews: React.ReactNode[] = [];
      if (!hideCompanyName) {
        companyViews.push(
          <ResumePDFText key="company" bold={true}>
            {company || ""}
          </ResumePDFText>
        );
      }

      return (
        <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
          {companyViews}
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: hideCompanyName ? "-" + spacing["1"] : spacing["1.5"],
            }}
          >
            <ResumePDFText>{jobTitle || ""}</ResumePDFText>
            <ResumePDFText>{date || ""}</ResumePDFText>
          </View>
          {(() => {
            const safeDescriptions = (descriptions || []).filter(
              (d) => typeof d === "string" && d.trim() !== ""
            );
            if (safeDescriptions.length === 0) return null;
            return (
              <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                <ResumePDFBulletList items={safeDescriptions} showBulletPoints={!hideBullets} />
              </View>
            );
          })()}
        </View>
      );
    }
  );

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {experienceViews}
    </ResumePDFSection>
  );
};
