/**
 * Template Components Index
 * Exports all shared section components
 */

import Header from './Header.js';
import PageSection from './PageSection.js';
import PageSummary from './PageSummary.js';

import AwardItem from './items/AwardItem.js';
import CertificationItem from './items/CertificationItem.js';
import EducationItem from './items/EducationItem.js';
import ExperienceItem from './items/ExperienceItem.js';
import InterestItem from './items/InterestItem.js';
import LanguageItem from './items/LanguageItem.js';
import ProfileItem from './items/ProfileItem.js';
import ProjectItem from './items/ProjectItem.js';
import PublicationItem from './items/PublicationItem.js';
import ReferenceItem from './items/ReferenceItem.js';
import SkillItem from './items/SkillItem.js';
import SummaryItem from './items/SummaryItem.js';
import VolunteerItem from './items/VolunteerItem.js';

export function getComponent(name) {
  switch (name) {
    case 'Header':
      return Header;
    case 'PageSection':
      return PageSection;
    case 'PageSummary':
      return PageSummary;
    case 'items/AwardItem':
      return AwardItem;
    case 'items/CertificationItem':
      return CertificationItem;
    case 'items/EducationItem':
      return EducationItem;
    case 'items/ExperienceItem':
      return ExperienceItem;
    case 'items/InterestItem':
      return InterestItem;
    case 'items/LanguageItem':
      return LanguageItem;
    case 'items/ProfileItem':
      return ProfileItem;
    case 'items/ProjectItem':
      return ProjectItem;
    case 'items/PublicationItem':
      return PublicationItem;
    case 'items/ReferenceItem':
      return ReferenceItem;
    case 'items/SkillItem':
      return SkillItem;
    case 'items/SummaryItem':
      return SummaryItem;
    case 'items/VolunteerItem':
      return VolunteerItem;
    default:
      return null;
  }
}

export default {
  Header,
  PageSection,
  PageSummary,
  AwardItem,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  InterestItem,
  LanguageItem,
  ProfileItem,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  SkillItem,
  SummaryItem,
  VolunteerItem,
};