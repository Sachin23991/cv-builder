import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const safeEducations = (educations || []).filter(Boolean);

  const educationViews: React.ReactNode[] = safeEducations.map(
    ({ school, degree, date, gpa, descriptions = [], hideBullets }, idx) => {
      const hideSchoolName =
        idx > 0 && school === safeEducations[idx - 1]?.school;
      const safeDescriptions = (descriptions || []).filter(
        (d) => typeof d === "string" && d.trim() !== ""
      );
      const showDescriptions = safeDescriptions.length > 0;

      const schoolViews: React.ReactNode[] = [];
      if (!hideSchoolName) {
        schoolViews.push(
          <ResumePDFText key="school" bold={true}>
            {school || ""}
          </ResumePDFText>
        );
      }

      const degreeLabel = gpa
        ? `${degree || ""} - ${Number(gpa) ? gpa + " GPA" : gpa}`
        : degree || "";

      const descViews: React.ReactNode[] = [];
      if (showDescriptions) {
        // If hideBullets is explicitly set, it overrides the section-level showBulletPoints
        const shouldShowBullets = hideBullets !== undefined ? !hideBullets : showBulletPoints;
        
        descViews.push(
          <View
            key="desc"
            style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}
          >
            <ResumePDFBulletList
              items={safeDescriptions}
              showBulletPoints={shouldShowBullets}
            />
          </View>
        );
      }

      return (
        <View key={idx}>
          {schoolViews}
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: hideSchoolName
                ? "-" + spacing["1"]
                : spacing["1.5"],
            }}
          >
            <ResumePDFText>{degreeLabel}</ResumePDFText>
            <ResumePDFText>{date || ""}</ResumePDFText>
          </View>
          {descViews}
        </View>
      );
    }
  );

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {educationViews}
    </ResumePDFSection>
  );
};
