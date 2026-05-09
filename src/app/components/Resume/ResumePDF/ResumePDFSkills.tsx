import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumeFeaturedSkill,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const { descriptions = [], featuredSkills = [] } = skills || {};
  const featuredSkillsWithText = featuredSkills.filter((item) => item && item.skill);

  // Pre-build featured skills into pairs of 3 columns × 2 rows
  const col0 = [featuredSkillsWithText[0], featuredSkillsWithText[3]].filter(Boolean);
  const col1 = [featuredSkillsWithText[1], featuredSkillsWithText[4]].filter(Boolean);
  const col2 = [featuredSkillsWithText[2], featuredSkillsWithText[5]].filter(Boolean);
  const cols = [col0, col1, col2].filter((c) => c.length > 0);

  const featuredViews: React.ReactNode[] = [];
  if (featuredSkillsWithText.length > 0) {
    const colViews: React.ReactNode[] = cols.map((col, colIdx) => {
      const skillViews: React.ReactNode[] = col.map((fs, rowIdx) => (
        <ResumeFeaturedSkill
          key={rowIdx}
          skill={fs!.skill}
          rating={fs!.rating}
          themeColor={themeColor}
          style={{ justifyContent: "flex-end" }}
        />
      ));
      return (
        <View key={colIdx} style={{ ...styles.flexCol }}>
          {skillViews}
        </View>
      );
    });

    featuredViews.push(
      <View
        key="featured"
        style={{ ...styles.flexRowBetween, marginTop: spacing["0.5"] }}
      >
        {colViews}
      </View>
    );
  }

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {featuredViews}
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions || []}
          showBulletPoints={showBulletPoints}
        />
      </View>
    </ResumePDFSection>
  );
};
