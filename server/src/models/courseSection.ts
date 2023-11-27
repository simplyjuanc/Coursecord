import { CourseSection } from './index';

async function addUnitToSection(sectionId: string, unitId: string) {
  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: {
      content: { push: unitId },
    },
  });

  return updatedSection;
}

async function getSectionById(sectionId: string) {
  const section = await CourseSection.findUnique({ where: { id: sectionId } });
  return section;
}

async function removeUnitFromSection(sectionId: string, unitId: string) {
  const section = await getSectionById(sectionId);
  if (!section) throw new Error('No unique section found');

  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: { content: section.content.filter((id) => id !== unitId) },
  });

  return updatedSection;
}

async function setSectionUnits(sectionId: string, units: string[]) {
  const updatedSection = await CourseSection.update({
    where: { id: sectionId },
    data: { content: units },
  });

  return updatedSection
}

async function getSectionsWithUnit(unitId: string) {
  const sections = await CourseSection.findMany({
    where: { content: { has: unitId } },
  });

  return sections;
}

export default {
  addUnitToSection,
  getSectionById,
  removeUnitFromSection,
  setSectionUnits,
  getSectionsWithUnit,
};
