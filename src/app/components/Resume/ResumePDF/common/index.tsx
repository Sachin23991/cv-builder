import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  const sectionStyle = {
    ...styles.flexCol,
    gap: spacing["2"],
    marginTop: spacing["5"],
    ...style,
  };

  const headingViews: React.ReactNode[] = [];
  if (heading) {
    const headingInnerViews: React.ReactNode[] = [];
    if (themeColor) {
      headingInnerViews.push(
        <View
          key="bar"
          style={{
            height: "3.75pt",
            width: "30pt",
            backgroundColor: themeColor,
            marginRight: spacing["3.5"],
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        />
      );
    }
    headingInnerViews.push(
      <Text
        key="label"
        style={{
          fontWeight: "bold",
          letterSpacing: "0.3pt",
        }}
        debug={DEBUG_RESUME_PDF_FLAG}
      >
        {heading}
      </Text>
    );
    headingViews.push(
      <View key="heading" style={{ ...styles.flexRow, alignItems: "center" }}>
        {headingInnerViews}
      </View>
    );
  }

  return (
    <View style={sectionStyle}>
      {headingViews}
      {children}
    </View>
  );
};

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  const safeChildren =
    children === null || children === undefined ? "" : children;
  return (
    <Text
      style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {safeChildren}
    </Text>
  );
};

export const ResumePDFBulletList = ({
  items,
  showBulletPoints = true,
}: {
  items: string[];
  showBulletPoints?: boolean;
}) => {
  const safeItems = (items || []).filter((i) => typeof i === "string" && i.trim() !== "");

  if (safeItems.length === 1 && safeItems[0]?.startsWith("<")) {
    const Html = require("react-pdf-html").default;
    return (
      <View style={{ ...styles.flexCol, fontSize: 10 }}>
        <Html
          stylesheet={{
            p: { margin: 0, padding: 0, lineHeight: 1.3, color: DEFAULT_FONT_COLOR },
            ul: { margin: 0, padding: 0, paddingLeft: 10 },
            ol: { margin: 0, padding: 0, paddingLeft: 10 },
            li: { margin: 0, padding: 0, lineHeight: 1.3, color: DEFAULT_FONT_COLOR },
            a: { textDecoration: "none", color: DEFAULT_FONT_COLOR },
          }}
        >
          {safeItems[0]}
        </Html>
      </View>
    );
  }

  const rows: React.ReactNode[] = safeItems.map((item, idx) => {
    const rowItems: React.ReactNode[] = [];
    if (showBulletPoints) {
      rowItems.push(
        <ResumePDFText
          key="bullet"
          style={{
            paddingLeft: spacing["2"],
            paddingRight: spacing["2"],
            lineHeight: "1.3",
          }}
          bold={true}
        >
          {"•"}
        </ResumePDFText>
      );
    }
    rowItems.push(
      <ResumePDFText
        key="text"
        style={{ lineHeight: "1.3", flexGrow: 1, flexBasis: 0 }}
      >
        {item}
      </ResumePDFText>
    );
    return (
      <View key={idx} style={{ ...styles.flexRow }}>
        {rowItems}
      </View>
    );
  });

  return <View style={{ ...styles.flexCol }}>{rows}</View>;
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;
  const circles: React.ReactNode[] = [];
  for (let idx = 0; idx < numCircles; idx++) {
    circles.push(
      <View
        key={idx}
        style={{
          height: "9pt",
          width: "9pt",
          marginLeft: "2.25pt",
          backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
          borderRadius: "100%",
        }}
      />
    );
  }

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {circles}
    </View>
  );
};
