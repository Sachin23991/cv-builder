import resumeReducer, {
  initialResumeState,
  changeProfile,
  addSectionInForm,
  changeWorkExperiences,
  moveSectionInForm,
  deleteSectionInFormByIdx,
} from "../resumeSlice";

describe("Resume Redux Slice", () => {
  it("should handle initial state", () => {
    expect(resumeReducer(undefined, { type: "unknown" })).toEqual(initialResumeState);
  });

  it("should handle changeProfile (edit name)", () => {
    const actual = resumeReducer(initialResumeState, changeProfile({ field: "name", value: "John Doe" }));
    expect(actual.profile.name).toEqual("John Doe");
  });

  it("should handle addSectionInForm for workExperiences", () => {
    const actual = resumeReducer(initialResumeState, addSectionInForm({ form: "workExperiences" }));
    expect(actual.workExperiences.length).toEqual(2);
    expect(actual.workExperiences[1].company).toEqual("");
  });

  it("should handle changeWorkExperiences", () => {
    const actual = resumeReducer(initialResumeState, changeWorkExperiences({ idx: 0, field: "company", value: "Acme Corp" }));
    expect(actual.workExperiences[0].company).toEqual("Acme Corp");
  });

  it("should handle deleteSectionInFormByIdx", () => {
    let state = resumeReducer(initialResumeState, addSectionInForm({ form: "workExperiences" })); // 2 items
    state = resumeReducer(state, changeWorkExperiences({ idx: 1, field: "company", value: "To be deleted" }));
    state = resumeReducer(state, deleteSectionInFormByIdx({ form: "workExperiences", idx: 1 }));
    expect(state.workExperiences.length).toEqual(1);
    expect(state.workExperiences[0].company).not.toEqual("To be deleted");
  });

  it("should handle moveSectionInForm (up)", () => {
    let state = resumeReducer(initialResumeState, addSectionInForm({ form: "workExperiences" })); // 2 items
    state = resumeReducer(state, changeWorkExperiences({ idx: 0, field: "company", value: "First" }));
    state = resumeReducer(state, changeWorkExperiences({ idx: 1, field: "company", value: "Second" }));
    
    // Move index 1 UP
    state = resumeReducer(state, moveSectionInForm({ form: "workExperiences", idx: 1, direction: "up" }));
    expect(state.workExperiences[0].company).toEqual("Second");
    expect(state.workExperiences[1].company).toEqual("First");
  });

  it("should handle moveSectionInForm (down)", () => {
    let state = resumeReducer(initialResumeState, addSectionInForm({ form: "workExperiences" })); // 2 items
    state = resumeReducer(state, changeWorkExperiences({ idx: 0, field: "company", value: "First" }));
    state = resumeReducer(state, changeWorkExperiences({ idx: 1, field: "company", value: "Second" }));
    
    // Move index 0 DOWN
    state = resumeReducer(state, moveSectionInForm({ form: "workExperiences", idx: 0, direction: "down" }));
    expect(state.workExperiences[0].company).toEqual("Second");
    expect(state.workExperiences[1].company).toEqual("First");
  });
});
