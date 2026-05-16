import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
}) => {
  const safeProjects = (projects || []).filter(Boolean);

  const projectViews: React.ReactNode[] = safeProjects.map(
    ({ project, date, descriptions, hideBullets }, idx) => (
      <View key={idx}>
        <View
          style={{
            ...styles.flexRowBetween,
            marginTop: spacing["0.5"],
          }}
        >
          <ResumePDFText bold={true}>{project || ""}</ResumePDFText>
          <ResumePDFText>{date || ""}</ResumePDFText>
        </View>
        {(() => {
          const safeDescriptions = (descriptions || []).filter(
            (d) => typeof d === "string" && d.trim() !== ""
          );
          if (safeDescriptions.length === 0) return null;
          return (
            <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
              <ResumePDFBulletList items={safeDescriptions} showBulletPoints={!hideBullets} />
            </View>
          );
        })()}
      </View>
    )
  );

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {projectViews}
    </ResumePDFSection>
  );
};
