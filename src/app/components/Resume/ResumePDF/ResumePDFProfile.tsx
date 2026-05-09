import { View } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location } = profile;

  // Build icon rows ahead of time — never return null inside react-pdf JSX
  type IconEntry = { key: string; value: string; iconType: IconType; src: string; isLink: boolean };
  const iconEntries: IconEntry[] = [];

  const rawIconProps: [string, string][] = [
    ["email", email],
    ["phone", phone],
    ["location", location],
    ["url", url],
  ];

  for (const [key, value] of rawIconProps) {
    if (!value) continue;
    let iconType: IconType = key as IconType;
    if (key === "url") {
      if (value.includes("github")) iconType = "url_github";
      else if (value.includes("linkedin")) iconType = "url_linkedin";
    }
    const isLink = ["email", "url", "phone"].includes(key);
    let src = "";
    if (isLink) {
      if (key === "email") src = `mailto:${value}`;
      else if (key === "phone") src = `tel:${value.replace(/[^\d+]/g, "")}`;
      else src = value.startsWith("http") ? value : `https://${value}`;
    }
    iconEntries.push({ key, value, iconType, src, isLink });
  }

  const iconRows: React.ReactNode[] = iconEntries.map(
    ({ key, value, iconType, src, isLink }) => (
      <View
        key={key}
        style={{
          ...styles.flexRow,
          alignItems: "center",
          gap: spacing["1"],
        }}
      >
        <ResumePDFIcon type={iconType} isPDF={isPDF} />
        {isLink ? (
          <ResumePDFLink src={src} isPDF={isPDF}>
            <ResumePDFText>{value}</ResumePDFText>
          </ResumePDFLink>
        ) : (
          <ResumePDFText>{value}</ResumePDFText>
        )}
      </View>
    )
  );

  const summaryViews: React.ReactNode[] = [];
  if (summary) {
    summaryViews.push(
      <ResumePDFText key="summary">{summary}</ResumePDFText>
    );
  }

  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <ResumePDFText
        bold={true}
        themeColor={themeColor}
        style={{ fontSize: "20pt" }}
      >
        {name || ""}
      </ResumePDFText>
      {summaryViews}
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {iconRows}
      </View>
    </ResumePDFSection>
  );
};
