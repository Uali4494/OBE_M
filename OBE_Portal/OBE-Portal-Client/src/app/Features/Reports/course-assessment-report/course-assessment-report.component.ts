import { Component, OnInit } from '@angular/core';
import { CoursesSearchService } from '../../../Services/CourseSearch/CourseSearch.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalService } from '../../../Shared/Services/Global/global.service';
import { ReportsService } from '../../../Services/Reports/reports.service';
import { AssignedCoursesService } from '../../../Services/AssignedCourses/assignedCourses.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare const $: any;

@Component({
  selector: 'app-course-assessment-report',
  templateUrl: './course-assessment-report.component.html',
  styleUrls: ['./course-assessment-report.component.css']
})
export class CourseAssessmentReportComponent implements OnInit {

  Institutes: any[] = [];
  Department: any[] = [];
  All_Semester: any[] = [];
  All_Offered_Courses: any[] = [];
  Faculty: any[] = [];
  AssignedCourse_Request_lst: any;
  Get_Course_CLOS: any[] = [];
  Get_CLOS_Over_PLOS_Marks_Distribution: any[] = [];
  CourseGradeDistribution: any[] = [];
  GetAllStudentWhoPassedCourseButFailedCLODetailsResponse: any[] = [];
  CarFeedback: any = {};
  SelectedInstitute: string;
  SelectedDepartment: string;
  SelectedSemester: string;
  SelectedFaculty: string;
  SelectedCourse: string;

  FacultyMemberID: number;
  Total_Number_Of_Offered_Courses: number;
  Marks_Submitted_Number_Of_Offered_Courses: number;
  Not_Marks_Submitted_Number_Of_Offered_Courses: number;
  query: string = "";
  pager: any = {};
  page: any;
  pagesize: number = 10;
  dataset: any[] = [];
  serialNumber: number;

  Is_Permission_Institute: boolean = false;
  Is_Permission_Deaprtment: boolean = false;
  Is_Permission_Faculty: boolean = false;
  Is_Deparment_Selected: boolean = false;
  Direct_CLO_Edit: boolean = false;
  Indirect_CLO_Edit: boolean = false;
  Table1_Edit: boolean = false;
  Table2_Edit: boolean = false;
  Table3_Edit: boolean = false;
  Table4_Edit: boolean = false;
  CanDownload: boolean = false;

  Temp_Institute_ID: number;
  Temp_Deaprtment_ID: number;
  Temp_FacultyMember_ID: number;
  Total_Weightage: number;
  Total_PLOS: number;
  PLO1Total: number;
  PLO2Total: number;
  PLO3Total: number;
  PLO4Total: number;
  PLO5Total: number;
  PLO6Total: number;
  PLO7Total: number;
  PLO8Total: number;
  PLO9Total: number;
  PLO10Total: number;
  PLO11Total: number;
  PLO12Total: number;
  constructor(
    private _CoursesSearchService: CoursesSearchService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private _ReportsService: ReportsService,
    private AssignedCoursesservice: AssignedCoursesService,
  ) {
    $("#FacultyID").val('0');
    this.Direct_CLO_Edit = false;
    this.Indirect_CLO_Edit = false;
    this.Table1_Edit = false;
    this.Table2_Edit = false;
    this.Table3_Edit = false;
    this.Table4_Edit = false;
    this.CanDownload = false;
    
    this.Temp_Institute_ID = 0;
    this.Temp_Deaprtment_ID = 0;
    this.Temp_FacultyMember_ID = 0;
    this.Is_Permission_Institute = GlobalService.Permissions.indexOf("Institute_Dropdown") >= 0 ? true : false;
    this.Is_Permission_Deaprtment = GlobalService.Permissions.indexOf("Department_Dropdown") >= 0 ? true : false;
    this.Is_Permission_Faculty = GlobalService.Permissions.indexOf("Faculty_Dropdown") >= 0 ? true : false;
    if (!this.Is_Permission_Institute) {
      this.Temp_Institute_ID = GlobalService.Institute_ID;
    }
    if (!this.Is_Permission_Deaprtment) {
      this.Temp_Deaprtment_ID = GlobalService.Deaprtment_ID;
    }
    if (!this.Is_Permission_Faculty) {
      this.Temp_FacultyMember_ID = GlobalService.FacultyMember_ID;
    }
  }

  ngOnInit(): void {
    this.Is_Deparment_Selected = false;
    this.Get_Institutes();
    this.Get_Semester();
  }
  Get_Institutes() {
    this.ngxService.start();
    this.Institutes = [];
    this._CoursesSearchService.Get_Institute().
      subscribe(
        response => {
          try {
            if (response != null) {
              if (this.Temp_Institute_ID != 0) {
                this.Institutes = response.filter(x => x.InstituteID == this.Temp_Institute_ID);
                this.Get_Department(this.Temp_Institute_ID);
              } else {
                this.Institutes = response;
              }

            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!")
          }

        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!")
        });
  }
  Get_Semester() {
    this.ngxService.start();
    this.All_Semester = [];
    this._CoursesSearchService.Get_All_Semester().
      subscribe(
        response => {
          try {
            if (response != null) {
              this.All_Semester = response;
            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!")
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!")
        });
  }
  Get_Department(val) {
    if (val == undefined || val == null || val == "")
      return;
    this.ngxService.start();
    this.Department = [];
    this._CoursesSearchService.Get_Department(Number(val)).
      subscribe(
        response => {
          try {
            if (response != null) {
              if (this.Temp_Deaprtment_ID != 0) {
                this.Department = response.filter(x => x.DepartmentID == this.Temp_Deaprtment_ID);
                this.Is_Deparment_Selected = true;
              } else {
                this.Department = response;
              }
            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }


        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  Get_FacultyMembers(val) {
    debugger
    if (this.Temp_FacultyMember_ID === 0) {
      $("#FacultyID").val('0');
      if (val == undefined || val == null || val == "")
        return;
      this.ngxService.start();
      this.Faculty = [];
      this._CoursesSearchService.Get_FacultyMembers_For_Selected_Department_And_Semester({
        "Department_ID": Number(this.Temp_Deaprtment_ID !== 0 ? this.Temp_Deaprtment_ID:$("#DepartmentID").val()), "Semester_ID": Number(val)
      }).
        subscribe(
          response => {
            if (response != null) {
              if (this.Temp_FacultyMember_ID != 0) {
                this.Faculty = response.filter(x => x.FacultyMemberID == this.Temp_FacultyMember_ID);
                this.Temp_FacultyMember_ID = this.Faculty[0].FacultyMemberID
                this.Get_AssignedCourse(Number(this.Temp_FacultyMember_ID));
              } else {
                this.Faculty = response;
              }
            }
            this.ngxService.stop();
          },
          error => {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!")
          });
    } else {
      this.Get_AssignedCourse(this.Temp_FacultyMember_ID);
    }    
  }
  Get_AssignedCourse(val) {
    $("#OfferedCourseID").val('0');
    this.ngxService.start();
    this.AssignedCourse_Request_lst = [];
    this.AssignedCoursesservice.GetAssignedCourses({ "FacultyMember_ID": Number(val), "Semester_ID": Number($("#SemesterID").val()) }).
      subscribe(
        response => {
          try {
            if (response != null) {
              this.AssignedCourse_Request_lst = response;
            }
            else {
              this.AssignedCourse_Request_lst = [];
            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  Get_Course_Assessment_Report() {
    this.All_Offered_Courses = [];
    this.Get_Course_CLOS = [];
    var temp = this.AssignedCourse_Request_lst.filter(x => x.OfferedCourseID == Number($("#OfferedCourseID").val()))[0];
    if (!temp.Is_Completed) {
      this.toastr.error("Cannot generate selected course assessment report because marks of course is not submitted.", "Course Marks Not Submitted!");
      return;
    }
    if (Number($("#OfferedCourseID").val()) == 0 || $("#OfferedCourseID").val() == undefined) {
      this.toastr.error("Please select course", "Invalid Selection Criteria!");
      return;
    }
    this.ngxService.start();
    this._ReportsService.Get_All_Course_Data_For_Analysis(Number($("#OfferedCourseID").val())).
      subscribe(
        response => {
          try {
            this.SelectedInstitute="";
            this.SelectedDepartment = "";
            this.SelectedSemester = "";
            this.SelectedFaculty = "";
            this.SelectedCourse = "";
            this.Get_Course_CLOS = [];
            this.Get_CLOS_Over_PLOS_Marks_Distribution = [];
            this.CourseGradeDistribution = [];
            this.CarFeedback = {};
            if (response != null) {
              this.SelectedInstitute = $("#Institute option:selected").text();
              this.SelectedDepartment = $("#DepartmentID option:selected").text();
              this.SelectedSemester = $("#SemesterID option:selected").text();
              this.SelectedFaculty = $("#FacultyID option:selected").text();
              this.SelectedCourse = $("#OfferedCourseID").val();
              this.CanDownload = true;
              this.Get_Course_CLOS = response.GetCourseCLOS;
              this.Get_CLOS_Over_PLOS_Marks_Distribution = response.CourseCLOSOverPLOS;
              this.CarFeedback = response.CarFeedbackResponse;
              this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse = response.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse;
              this.Total_Weightage = 0;
              this.Total_PLOS = 0;
              this.PLO1Total = 0;
              this.PLO2Total = 0;
              this.PLO3Total = 0;
              this.PLO4Total = 0;
              this.PLO5Total = 0;
              this.PLO6Total = 0;
              this.PLO7Total = 0;
              this.PLO8Total = 0;
              this.PLO9Total = 0;
              this.PLO10Total = 0;
              this.PLO11Total = 0;
              this.PLO12Total = 0;

              for (var i = 0; i < this.Get_CLOS_Over_PLOS_Marks_Distribution.length; i++) {
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i]["TotalCLOMarks"] =
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P1Marks + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P2Marks +
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P3Marks + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P4Marks +
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P5Marks + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P6Marks +
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P7Marks + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P8Marks +
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P9Marks + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P10Marks +
                this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P11Marks + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P12Marks;

                this.Get_CLOS_Over_PLOS_Marks_Distribution[i]["TotalCLOWeightage"] =
                  Math.round((this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P1Weightage + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P2Weightage +
                    this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P3Weightage + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P4Weightage +
                    this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P5Weightage + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P6Weightage +
                    this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P7Weightage + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P8Weightage +
                    this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P9Weightage + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P10Weightage +
                    this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P11Weightage + this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P12Weightage)
                    / this.Get_CLOS_Over_PLOS_Marks_Distribution[i].AssesssmentMappedCount);


                this.Total_Weightage += this.Get_CLOS_Over_PLOS_Marks_Distribution[i]["TotalCLOWeightage"];
                this.PLO1Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P1Marks;
                this.PLO2Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P2Marks;
                this.PLO3Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P3Marks;
                this.PLO4Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P4Marks;
                this.PLO5Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P5Marks;
                this.PLO6Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P6Marks;
                this.PLO7Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P7Marks;
                this.PLO8Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P8Marks;
                this.PLO9Total  += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P9Marks;
                this.PLO10Total += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P10Marks;
                this.PLO11Total += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P11Marks;
                this.PLO12Total += this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P12Marks;
              }
              this.Total_Weightage = Math.round(this.Total_Weightage / this.Get_CLOS_Over_PLOS_Marks_Distribution?.length);
                this.Total_PLOS =
                this.PLO1Total + this.PLO2Total + this.PLO3Total + this.PLO4Total + this.PLO5Total +
                this.PLO6Total + this.PLO7Total + this.PLO8Total + this.PLO9Total + this.PLO10Total + this.PLO11Total + this.PLO12Total;
              for (var i = 0; i < response.CourseGradeDistribution.length; i++) {
                this.CourseGradeDistribution.push({
                  "GradingSchemeID" : response.CourseGradeDistribution[i].GradingSchemeID,
                  "Grades"          : response.CourseGradeDistribution[i].Grades.split(','),
                  "GradesCount"     : response.CourseGradeDistribution[i].GradesCount.split(','),
                  "MinMarks"        : response.CourseGradeDistribution[i].MinMarks.split(','),
                  "MaxMarks"        : response.CourseGradeDistribution[i].MaxMarks.split(','),
                  "AverageMarks"    : response.CourseGradeDistribution[i].AverageMarks,
                  "AverageGrade"    : response.CourseGradeDistribution[i].AverageGrade,
                  "AverageGPAPoints": response.CourseGradeDistribution[i].AverageGPAPoints,
                  "GradesCountForTD": response.CourseGradeDistribution[i].Grades.split(',').length,
                })
              }
              if (response.CarFeedbackResponse.Tb1Q1Answer === "Sufficient") {
                $("#Q1Sufficient").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb1Q1Answer === "Insufficient") {
                $("#Q1Insufficient").prop('checked', true)
              }
              $("#Tb1Q1Remarks").val(response.CarFeedbackResponse.Tb1Q1Remarks);

              if (response.CarFeedbackResponse.Tb1Q2Answer === "Yes") {
                $("#Q2Yes").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb1Q2Answer === "No") {
                $("#Q2No").prop('checked', true)
              }
              $("#Tb1Q2Remarks").val(response.CarFeedbackResponse.Tb1Q2Remarks);

              if (response.CarFeedbackResponse.Tb1Q3Answer === "Fully Covered") {
                $("#Q3FullyCovered").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb1Q3Answer === "Partially Covered") {
                $("#Q3PartiallyCovered").prop('checked', true)
              }
              $("#Tb1Q3Remarks").val(response.CarFeedbackResponse.Tb1Q3Remarks);


              if (response.CarFeedbackResponse.Tb2Q1Answer === "Minimum Level") {
                $("#Q1MinimumLevel").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb2Q1Answer === "Partially Covered") {
                $("#Q1PartiallyCovered").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb2Q1Answer === "None") {
                $("#Q1None").prop('checked', true)
              }
              $("#Tb2Q1Remarks").val(response.CarFeedbackResponse.Tb2Q1Remarks);


              if (response.CarFeedbackResponse.Tb2Q2Answer === "Active Learning") {
                $("#Q2ActiveLearning").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb2Q2Answer === "Cooperative Learning") {
                $("#Q2ProblemBasedLearning").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb2Q2Answer === "Problem Based Learning") {
                $("#Q2ProblemBasedLearning").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb2Q2Answer === "Project Based Learning") {
                $("#Q2ProjectBasedLearning").prop('checked', true)
              }
              $("#Tb2Q2Remarks").val(response.CarFeedbackResponse.Tb2Q2Remarks);

              if (response.CarFeedbackResponse.Tb2Q3Answer === "Responded Well") {
                $("#Q3RespondedWell").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb2Q3Answer === "Did Not Respond Well") {
                $("#Q3DidNotRespondWell").prop('checked', true)
              }
              $("#Tb2Q3Remarks").val(response.CarFeedbackResponse.Tb2Q3Remarks);

              $("#Quiz").val(response.CarFeedbackResponse.QuizPerformance);
              $("#Assignment").val(response.CarFeedbackResponse.AssignmentPerformance);
              $("#CourseProject").val(response.CarFeedbackResponse.ProjectPerformance);
              $("#MidsFinals").val(response.CarFeedbackResponse.MidsFinalPerformance);
              $("#Presentation").val(response.CarFeedbackResponse.PresentationPerformance);
              $("#CEP").val(response.CarFeedbackResponse.CEPPerformance);
              $("#Tb3Q1Remarks").val(response.CarFeedbackResponse.Tb3Q1Remarks);

              if (response.CarFeedbackResponse.Tb3Q2Answer === "Well Distributed") {
                $("#Q2WellDistributed").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb3Q2Answer === "Needs Re-Distribution") {
                $("#Q2NeedsReDistribution").prop('checked', true)
              }
              $("#Tb3Q2Remarks").val(response.CarFeedbackResponse.Tb3Q2Remarks);

              $("#FailedCLOS").val(response.CarFeedbackResponse.NumberOfCLOFailed);
              $("#FailedStudentsInCLOS").val(response.CarFeedbackResponse.NumberOfStudentFailedInCLO);
              $("#FailedPLOS").val(response.CarFeedbackResponse.NumberOfPLOFailed);
              $("#FailedStudentsInPLOS").val(response.CarFeedbackResponse.NumberOfStudentFailedInPLO);

              if (response.CarFeedbackResponse.Tb4Q1Answer === "Workshop") {
                $("#Q1Workshop").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb4Q1Answer === "Comprehensive Assignment") {
                $("#Q1ComprehensiveAssignment").prop('checked', true)
              }
              if (response.CarFeedbackResponse.Tb4Q1Answer === "Repeat Course") {
                $("#Q1RepeatCourse").prop('checked', true)
              }
              $("#Tb4Q2Remarks").val(response.CarFeedbackResponse.Tb4Q2Remarks);

            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });

  }
  DirectEdit() {
    $(".DirectCLO").removeClass('hidden');
    $(".DirectCLOAddedComment").addClass('hidden');
    this.Direct_CLO_Edit = true;
  }
  CancelDirectAssessment() {
    $(".DirectCLO").addClass('hidden');
    $(".DirectCLOAddedComment").removeClass('hidden');
    this.Direct_CLO_Edit = false;
  }
  IndirectEdit() {
    $(".IndirectCLO").removeClass('hidden');
    $(".IndirectCLOAddedComment").addClass('hidden');
    this.Indirect_CLO_Edit = true;
  }
  CancelIndirectAssessment() {
    $(".IndirectCLO").addClass('hidden');
    $(".IndirectCLOAddedComment").removeClass('hidden');
    this.Indirect_CLO_Edit = false;
  }
  SaveDirectRemarks() {
    this.ngxService.start();
    var DirectRemarks = [];
    for (var i = 0; i < this.Get_Course_CLOS.length; i++) {
      DirectRemarks.push({ "CourseCLOID": Number(this.Get_Course_CLOS[i].CoursesCLOSID), "Remarks": $("#DirectCLO"+i).val()})
      this.Get_Course_CLOS[i].Direct_Remarks_CQI_Cycle = $("#DirectCLO" + i).val();
    }  
    this._ReportsService.SaveDirectRemarks(DirectRemarks).
      subscribe(
        response => {
          try {
            if (response) {
              this.toastr.success("Remarks saved successfully", "Success!");
              this.CancelDirectAssessment();
            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  SaveIndirectRemarks() {
    this.ngxService.start();
    var DirectRemarks = [];
    for (var i = 0; i < this.Get_Course_CLOS.length; i++) {
      DirectRemarks.push({ "CourseCLOID": Number(this.Get_Course_CLOS[i].CoursesCLOSID), "Remarks": $("#IndirectCLO" + i).val() })
      this.Get_Course_CLOS[i].Indirect_Remarks = $("#IndirectCLO" + i).val();
    }

    this._ReportsService.SaveIndirectRemarks(DirectRemarks).
      subscribe(
        response => {
          try {
            if (response) {
              this.toastr.success("Remarks saved successfully", "Success!");
              this.CancelIndirectAssessment();
            }
            this.ngxService.stop();
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  Table1Edit() {
    this.Table1_Edit = true;
  }
  Table2Edit() {
    this.Table2_Edit = true;
  }
  Table3Edit() {
    this.Table3_Edit = true;
  }
  Table4Edit() {
    this.Table4_Edit = true;
  }
  CancelTable1Form() {
    this.Table1_Edit = false;
  }
  CancelTable2Form() {
    this.Table2_Edit = false;
  }
  CancelTable3Form() {
    this.Table3_Edit = false;
  }
  CancelTable4Form() {
    this.Table4_Edit = false;
  }
  SaveTable1Form() {
    if (Number($("#OfferedCourseID").val()) == 0 || $("#OfferedCourseID").val() == undefined) {
      this.toastr.error("Please select course", "Invalid Selection Criteria!");
      return;
    }
    this.ngxService.start();
    this.CanDownload = false;
    var Form1Data = {};
    Form1Data = {
      "Q1Answer":        $('input[name="Tb1Q1"]:checked').val(),
      "Q1Remarks":       $('#Tb1Q1Remarks').val(),
      "Q2Answer":        $('input[name="Tb1Q2"]:checked').val(),
      "Q2Remarks":       $('#Tb1Q2Remarks').val(),
      "Q3Answer":        $('input[name="Tb1Q3"]:checked').val(),
      "Q3Remarks":       $('#Tb1Q3Remarks').val(),
      "OfferedCourseID": Number($("#OfferedCourseID").val()),
      "UserID":          Number(GlobalService.FacultyMember_ID)
    };

    this._ReportsService.SaveTable1Form(Form1Data).
      subscribe(
        response => {
          try {
            this.ngxService.stop();
            if (response) {
              this.toastr.success("Remarks saved successfully", "Success!");
              this.CancelTable1Form();
            }
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  SaveTable2Form() {
    if (Number($("#OfferedCourseID").val()) == 0 || $("#OfferedCourseID").val() == undefined) {
      this.toastr.error("Please select course", "Invalid Selection Criteria!");
      return;
    }
    this.ngxService.start();
    var Form2Data = {};
    Form2Data = {
      "Q1Answer": $('input[name="Tb2Q1"]:checked').val(),
      "Q1Remarks": $('#Tb2Q1Remarks').val(),
      "Q2Answer": $('input[name="Tb2Q2"]:checked').val(),
      "Q2Remarks": $('#Tb2Q2Remarks').val(),
      "Q3Answer": $('input[name="Tb2Q3"]:checked').val(),
      "Q3Remarks": $('#Tb2Q3Remarks').val(),
      "OfferedCourseID": Number($("#OfferedCourseID").val()),
      "UserID": Number(GlobalService.FacultyMember_ID)
    };
    this.CanDownload = false;
    this._ReportsService.SaveTable2Form(Form2Data).
      subscribe(
        response => {
          try {
            this.ngxService.stop();
            if (response) {
              this.toastr.success("Remarks saved successfully", "Success!");
              this.CancelTable2Form();
            }
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  SaveTable3Form() {
    if (Number($("#OfferedCourseID").val()) == 0 || $("#OfferedCourseID").val() == undefined) {
      this.toastr.error("Please select course", "Invalid Selection Criteria!");
      return;
    }
    this.ngxService.start();
    var Form3Data = {};
    Form3Data = {
      "Quiz":            Number($('#Quiz').val()),
      "Assignment":      Number($('#Assignment').val()),
      "CourseProject":   Number($('#CourseProject').val()),
      "MidsFinals":      Number($('#MidsFinals').val()),
      "Presentation":    Number($('#Presentation').val()),
      "CEP":             Number($('#CEP').val()),
      "Tb3Q1Remarks":    $('#Tb3Q1Remarks').val(),
      "Tb3Q2":           $('input[name="Tb3Q2"]:checked').val(),
      "Tb3Q2Remarks":    $('#Tb3Q2Remarks').val(),
      "OfferedCourseID": Number($("#OfferedCourseID").val()),
      "UserID":          Number(GlobalService.FacultyMember_ID)
    };
    this.CanDownload = false;
    this._ReportsService.SaveTable3Form(Form3Data).
      subscribe(
        response => {
          try {
            this.ngxService.stop();
            if (response) {
              this.toastr.success("Remarks saved successfully", "Success!");
              this.CancelTable3Form();
            }
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  SaveTable4Form() {
    if (Number($("#OfferedCourseID").val()) == 0 || $("#OfferedCourseID").val() == undefined) {
      this.toastr.error("Please select course", "Invalid Selection Criteria!");
      return;
    }
    this.ngxService.start();
    var Form4Data = {};
    Form4Data = {
      "FailedCLOS": Number($('#FailedCLOS').val()),
      "FailedStudentsInCLOS": Number($('#FailedStudentsInCLOS').val()),
      "FailedPLOS": Number($('#FailedPLOS').val()),
      "FailedStudentsInPLOS": Number($('#FailedStudentsInPLOS').val()),
      "Tb4Q1": $('input[name="Tb4Q1"]:checked').val(),
      "Tb4Q2Remarks": $('#Tb4Q2Remarks').val(),
      "OfferedCourseID": Number($("#OfferedCourseID").val()),
      "UserID": Number(GlobalService.FacultyMember_ID)
    };
    this.CanDownload = false;
    this._ReportsService.SaveTable4Form(Form4Data).
      subscribe(
        response => {
          try {
            this.ngxService.stop();
            if (response) {
              this.toastr.success("Remarks saved successfully", "Success!");
              this.CancelTable4Form();
            }
          } catch (e) {
            this.ngxService.stop();
            this.toastr.error("Internal server error occured while processing your request", "Error!");
          }
        },
        error => {
          this.ngxService.stop();
          this.toastr.error("Internal server error occured while processing your request", "Error!");
        });
  }
  GeneratePDF() {
    var CourseDetails = this.AssignedCourse_Request_lst.filter(x => x.OfferedCourseID == Number(this.SelectedCourse))[0];

    var Table1 = [];
    var Table2 = [];
    var Table3 = [];
    var Table4 = [];
    var FailedStudent = [];
    var Table5 = [];
    var Table6 = [];
    var Table7 = [];
    var Table8 = [];
    Table1.push([
      { text: 'CLOs', alignment: 'center' },
      { text: 'Statement', alignment: 'center' },
      { text: 'Mapped PLO', alignment: 'center' },
      { text: 'Domain', alignment: 'center' },
      { text: 'Level', alignment: 'center' },
      { text: 'CLO Attainment', alignment: 'center' },
      { text: 'Remarks for CQI Cycle', alignment: 'center' }
    ]);
    Table2.push([
      { text: 'CLOs', alignment: 'center' },
      { text: 'Statement', alignment: 'center' },
      { text: 'Mapped PLO', alignment: 'center' },
      { text: 'Domain', alignment: 'center' },
      { text: 'Level', alignment: 'center' },
      { text: 'CLO Attainment', alignment: 'center' },
      { text: 'Comments / Remarks', alignment: 'center' }
    ]);
    Table3.push([
      { text: 'CLOs', alignment: 'center' },
      { text: 'PLO1', alignment: 'center' },
      { text: 'PLO2', alignment: 'center' },
      { text: 'PLO3', alignment: 'center' },
      { text: 'PLO4', alignment: 'center' },
      { text: 'PLO5', alignment: 'center' },
      { text: 'PLO6', alignment: 'center' },
      { text: 'PLO7', alignment: 'center' },
      { text: 'PLO8', alignment: 'center' },
      { text: 'PLO9', alignment: 'center' },
      { text: 'PLO10', alignment: 'center' },
      { text: 'PLO11', alignment: 'center' },
      { text: 'PLO12', alignment: 'center' },
      { text: 'Total Marks', alignment: 'center' },
      { text: 'Total Weightage', alignment: 'center' }
    ]);
    if (this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse?.length > 0) {
      FailedStudent.push([
        { text: 'Intake', alignment: 'center' },
        { text: 'Name', alignment: 'center' },
        { text: 'Enrollment', alignment: 'center' },
        { text: 'Total Marks', alignment: 'center' },
        { text: 'Grade', alignment: 'center' },
        { text: 'CLO Title', alignment: 'center' },
        { text: 'CLO Attainment', alignment: 'center' }
      ]);
      for (var i = 0; i < this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse.length; i++) {
        FailedStudent.push([
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].Intake,
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].Name,
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].Enrollment,
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].Total_Marks,
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].Grade,
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].CLOTitle,
          this.GetAllStudentWhoPassedCourseButFailedCLODetailsResponse[i].CLOResult.trim() + "%",
        ]);
      }
    }
    
    for (var i = 0; i < this.Get_Course_CLOS.length; i++) {
      Table1.push([
        this.Get_Course_CLOS[i].CLOTitle,
        this.Get_Course_CLOS[i].CLODescription,
        this.Get_Course_CLOS[i].PLO_Title,
        this.Get_Course_CLOS[i].CLO_Skill_Title,
        this.Get_Course_CLOS[i].CLO_Skill_Level_Title,
        this.Get_Course_CLOS[i].CLO_Attainment + "%",
        this.Get_Course_CLOS[i].Direct_Remarks_CQI_Cycle == null ? '': this.Get_Course_CLOS[i].Direct_Remarks_CQI_Cycle,
      ]);
      Table2.push([
        this.Get_Course_CLOS[i].CLOTitle,
        this.Get_Course_CLOS[i].CLODescription,
        this.Get_Course_CLOS[i].PLO_Title,
        this.Get_Course_CLOS[i].CLO_Skill_Title,
        this.Get_Course_CLOS[i].CLO_Skill_Level_Title,
        this.Get_Course_CLOS[i].CLO_Attainment + "%",
        this.Get_Course_CLOS[i].Indirect_Remarks == null ? '': this.Get_Course_CLOS[i].Indirect_Remarks,
      ]);
    }
    
    for (var i = 0; i < this.Get_CLOS_Over_PLOS_Marks_Distribution.length; i++) {
      Table3.push([
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].CLOTitle,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P1Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P1Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P2Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P2Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P3Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P3Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P4Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P4Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P5Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P5Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P6Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P6Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P7Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P7Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P8Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P8Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P9Marks           === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P9Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P10Marks          === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P10Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P11Marks          === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P11Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P12Marks          === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].P12Marks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].TotalCLOMarks     === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].TotalCLOMarks,
        this.Get_CLOS_Over_PLOS_Marks_Distribution[i].TotalCLOWeightage === 0 ? '-' : this.Get_CLOS_Over_PLOS_Marks_Distribution[i].TotalCLOWeightage,
      ]);
    }
    Table3.push([
      'Total',
      this.PLO1Total == 0?'-': this.PLO1Total,
      this.PLO2Total == 0?'-': this.PLO2Total,
      this.PLO3Total == 0?'-': this.PLO3Total,
      this.PLO4Total == 0?'-': this.PLO4Total,
      this.PLO5Total == 0?'-': this.PLO5Total,
      this.PLO6Total == 0?'-': this.PLO6Total,
      this.PLO7Total == 0?'-': this.PLO7Total,
      this.PLO8Total == 0?'-': this.PLO8Total,
      this.PLO9Total == 0 ? '-' : this.PLO9Total,
      this.PLO10Total == 0?'-': this.PLO10Total,
      this.PLO11Total == 0?'-': this.PLO11Total,
      this.PLO12Total == 0 ? '-' : this.PLO12Total,
      this.Total_PLOS == 0 ? '-' : this.Total_PLOS,
      this.Total_Weightage == 0 ? '-' : this.Total_Weightage + "%",
    ]);
    // Table 4 grade distribution
    var finalTemp = [];
    var widths = [];
    for (var i = 0; i < this.CourseGradeDistribution.length; i++) {
      Table4 = [];
      widths = [];
      var temp = [];
      widths.push(this.CourseGradeDistribution[i].GradingSchemeID == 1 ? 233: 77);
      temp.push(
        { text: 'Grade Distribution', alignment: 'center' }
      );
      for (var j = 0; j < this.CourseGradeDistribution[i].Grades.length; j++) {
        temp.push(
          { text: this.CourseGradeDistribution[i].Grades[j], alignment: 'center' }
        );
        widths.push(30);
      }
      Table4.push(temp);
      temp = [];
      temp.push(
        { text: 'Number', alignment: 'center' }
      );
      for (var j = 0; j < this.CourseGradeDistribution[i].Grades.length; j++) {
        temp.push(
          { text: this.CourseGradeDistribution[i].MinMarks[j] + '-'+this.CourseGradeDistribution[i].MaxMarks[j], alignment: 'center' }
        );
      }

      Table4.push(temp);
      temp = [];

      temp.push(
        { text: 'Grade Count', alignment: 'center' }
      );
      for (var j = 0; j < this.CourseGradeDistribution[i].Grades.length; j++) {
        temp.push(
          { text: this.CourseGradeDistribution[i].GradesCount[j], alignment: 'center' }
        );
      }

      Table4.push(temp);
      temp = [];

      temp.push(
        { text: 'Average CGPA', alignment: 'center' }
      );
      temp.push(
        { text: this.CourseGradeDistribution[i].AverageGPAPoints, alignment: 'center', colSpan: this.CourseGradeDistribution[i].Grades.length }
      );

      Table4.push(temp);
      temp = [];

      temp.push(
        { text: 'Average Marks', alignment: 'center' }
      );
      temp.push(
        { text: this.CourseGradeDistribution[i].AverageMarks, alignment: 'center', colSpan: this.CourseGradeDistribution[i].Grades.length }
      );

      Table4.push(temp);
      temp = [];

      temp.push(
        { text: 'Average Grade', alignment: 'center' }
      );
      temp.push(
        { text: this.CourseGradeDistribution[i].AverageGrade, alignment: 'center', colSpan: this.CourseGradeDistribution[i].Grades.length}
      );

      Table4.push(temp);
      temp = [];
      finalTemp.push({
        style: 'table1',
        table: {
          widths: widths,
          body: Table4
        }
      });
    }

    Table5.push(
      [
        { text: 'Questions', alignment: 'center' },
        { text: 'Answer', alignment: 'center' },
        { text: 'Remarks', alignment: 'center' },
      ],
      [
        { text: 'Can the students meet the expected outcomes?.', alignment: 'left' },
        { text: this.CarFeedback.Tb1Q1Answer == null ? '' : this.CarFeedback.Tb1Q1Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb1Q1Remarks == null ? '' : this.CarFeedback.Tb1Q1Remarks, alignment: 'left' },
      ],
      [
        { text: 'Please comment on the course content approved for this course.', alignment: 'left' },
        { text: this.CarFeedback.Tb1Q2Answer == null ? '' : this.CarFeedback.Tb1Q2Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb1Q2Remarks == null ? '' : this.CarFeedback.Tb1Q2Remarks, alignment: 'left' },
      ],
      [
        { text: 'Please comment on the course content delivered by you.', alignment: 'left' },
        { text: this.CarFeedback.Tb1Q3Answer == null ? '' : this.CarFeedback.Tb1Q3Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb1Q3Remarks == null ? '' : this.CarFeedback.Tb1Q3Remarks, alignment: 'left' },
      ]);
    Table6.push(
      [
        { text: 'Questions', alignment: 'center' },
        { text: 'Answer', alignment: 'center' },
        { text: 'Remarks', alignment: 'center' },
      ],
      [
        { text: 'Please comment on the use of latest tools available.', alignment: 'left' },
        { text: this.CarFeedback.Tb2Q1Answer == null ? '' : this.CarFeedback.Tb2Q1Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb2Q1Remarks == null ? '' : this.CarFeedback.Tb2Q1Remarks, alignment: 'left' },
      ],
      [
        { text: 'Please comment on the other teaching method used.', alignment: 'left' },
        { text: this.CarFeedback.Tb2Q2Answer == null ? '' : this.CarFeedback.Tb2Q2Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb2Q2Remarks == null ? '' : this.CarFeedback.Tb2Q2Remarks, alignment: 'left' },
      ],
      [
        { text: 'Please comment on the students response to the teaching methods used.', alignment: 'left' },
        { text: this.CarFeedback.Tb2Q3Answer == null ? '' : this.CarFeedback.Tb2Q3Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb2Q3Remarks == null ? '' : this.CarFeedback.Tb2Q3Remarks, alignment: 'left' },
      ],
    );
    var temp1 = "";
    temp1 =
      'Quiz Performance % ' + (this.CarFeedback.QuizPerformance == 0 || this.CarFeedback.QuizPerformance ==  null ? '' : this.CarFeedback.QuizPerformance) +
    '\n Assignment Performance % ' + (this.CarFeedback.AssignmentPerformance == 0 || this.CarFeedback.AssignmentPerformance == null ? '' : this.CarFeedback.AssignmentPerformance) +
    '\n Project Performance % ' + (this.CarFeedback.ProjectPerformance == 0 || this.CarFeedback.ProjectPerformance == null ? '' : this.CarFeedback.ProjectPerformance) +
    '\n Mids/Finals Performance % ' + (this.CarFeedback.MidsFinalPerformance == 0 || this.CarFeedback.MidsFinalPerformance == null ? '' : this.CarFeedback.MidsFinalPerformance) +
    '\n Presentation Performance % ' + (this.CarFeedback.PresentationPerformance == 0 || this.CarFeedback.PresentationPerformance == null ? '' : this.CarFeedback.PresentationPerformance) +
    '\n CEP Performance % ' + (this.CarFeedback.CEPPerformance == 0 || this.CarFeedback.CEPPerformance == null ? '' : this.CarFeedback.CEPPerformance);
    Table7.push(
      [
        { text: 'Questions', alignment: 'center' },
        { text: 'Answer', alignment: 'center' },
        { text: 'Remarks', alignment: 'center' },
      ],
      [
        { text: 'Please comment on the assessment tools listed in the course outline which you have adopted.', alignment: 'left' },
        { text: temp1.toString(), alignment: 'left' },
        { text: this.CarFeedback.Tb3Q1Remarks == null ? '' : this.CarFeedback.Tb3Q1Remarks, alignment: 'left' },
      ],
      [
        { text: 'Please comment on the distribution of marks as stated in the course outline.', alignment: 'left' },
        { text: this.CarFeedback.Tb3Q2Answer == null ? '' : this.CarFeedback.Tb3Q2Answer, alignment: 'left' },
        { text: this.CarFeedback.Tb3Q2Remarks == null ? '' : this.CarFeedback.Tb3Q2Remarks, alignment: 'left' },
      ]
      );

    temp1 = "";
    temp1 =
      "CLO (Number of failed CLOs) " + (this.CarFeedback.NumberOfCLOFailed == 0 || this.CarFeedback.NumberOfCLOFailed == null ? '' : this.CarFeedback.NumberOfCLOFailed) +
    "\nCLO (Number of failing CLOs) " + (this.CarFeedback.NumberOfStudentFailedInCLO == 0 || this.CarFeedback.NumberOfStudentFailedInCLO == null ? '' : this.CarFeedback.NumberOfStudentFailedInCLO) +
    "\nPLO (Number of failed PLOs) " + (this.CarFeedback.NumberOfPLOFailed == 0 || this.CarFeedback.NumberOfPLOFailed == null ? '' : this.CarFeedback.NumberOfPLOFailed) +
    "\nPLO (Number of failing PLOs)  " + (this.CarFeedback.NumberOfStudentFailedInPLO == 0 || this.CarFeedback.NumberOfStudentFailedInPLO == null ? '' : this.CarFeedback.NumberOfStudentFailedInPLO);
      Table8.push(
        [
          { text: 'Questions', alignment: 'center' },
          { text: 'Answer', alignment: 'center' },
          { text: 'Remarks', alignment: 'center' },
        ],
        [
          { text: 'Please state the type of failure and your action plan details for closing the CQI cycle.', alignment: 'left' },
          { text: temp1.toString(), alignment: 'left' },
          { text: this.CarFeedback.Tb3Q1Remarks == null ? '' : this.CarFeedback.Tb3Q1Remarks, alignment: 'left' },
        ],
        [
          { text: 'Please state the implementation plan that you will adopt.', alignment: 'left' },
          { text: this.CarFeedback.Tb4Q1Answer == null ? '' : this.CarFeedback.Tb4Q1Answer , alignment: 'left' },
          { text: this.CarFeedback.Tb4Q2Remarks == null ? '' : this.CarFeedback.Tb4Q2Remarks, alignment: 'left' },
        ]
      );
    let docDefinition = {
      pageOrientation: 'A4',
      footer: function (currentPage, pageCount) { 
        return [
          {
            text: '        Faculty of Engineering Sciences, Bahria University                                                         Page '+currentPage.toString() + ' of ' + pageCount,
            alignment: 'center',
            fontSize: 10,
            bold: true,
          },
        ]
      },
      content: [
        {
          image: 'data:image/png;base64,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',
          width: 160,
          height: 115,
          alignment: 'center'
        },
        {
          text: 'Quality Assurance Directorate',
          style: 'header'
        },
        {
          text: 'Bahria University',
          style: 'header'
        },
        {
          text: 'Course Assessment Report – OBE',
          style: 'header'
        },
        {
          text: 'Department of ' + this.SelectedDepartment + ' ' + this.SelectedInstitute,
          style: 'header'
        },
        {
          style: 'table',
          table: {
            widths: [200, '*'],
            body: [
              ['Course Name', CourseDetails.Course_Alias],
              ['Course Code', CourseDetails.CourseCode],
              ['Total Number of Students', CourseDetails.Student_Count],
              ['Total Number of Lectures', '16'],
              ['Course Lecturer', this.SelectedFaculty],
              ['Cluster Head', ''],
              ['Report Date', new Date().toLocaleDateString()],
            ]
          }
        },
        {
          text: 'ATTAINMENT LEVEL OF CLOS (DIRECT)',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table',
          table: {
            widths: [20, 160, 60, 40, 40, 40, 91],
            body: Table1
          }
        },
        {
          text: 'STUDENT’S PERCEPTION ON THE ATTAINMENT OF CLOS/PLOS (INDIRECT)',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table',
          table: {
            widths: [20, 160, 60, 40, 40, 40, 91],
            body: Table2
          }
        },
        {
          text: 'CLO-PLO Mapping and Weightage',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table1',
          table: {
            widths: [30, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 55, 55],
            body: Table3
          }
        },
        {
          text: 'GRADE DISTRIBUTION',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        finalTemp,
        {
          text: 'Students who passed course but failed CLOs',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table',
          table: {
            widths: [40, 160, 60, 40, 40, 40, 71],
            body: FailedStudent,
          }
        },
        
        {
          text: 'COURSE CONTENTS',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table1',
          table: {
            widths: [200, 100, '*'],
            body: Table5
          }
        },
        {
          text: 'METHOD OF TEACHING',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table1',
          table: {
            widths: [200, 100, '*'],
            body: Table6
          }
        },
        {
          text: 'CORRECTIVE ACTION PLAN',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table1',
          table: {
            widths: [200, 100, '*'],
            body: Table7
          }
        },
        {
          text: 'CORRECTIVE ACTION PLAN',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          style: 'table1',
          table: {
            widths: [200, 100, '*'],
            body: Table8
          }
        },
        {
          style: 'table2',
          table: {
            widths: [200, '*'],
            body: [
              ['Comments', ''],
              ['Subject Domain Specialist,', ''],
              ['Cluster Head,',''],
              ['Department Head', ''],
              ['Signature', ''],
              ['Report Date', new Date().toLocaleDateString()],
            ]
          }
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        table: {
          fontSize: 8,
          margin:[0,0,0,10]
        },
        table1: {
          fontSize: 8,
          margin: [0, 0, 0, 10],
          alignment: 'center',
        },
        table2: {
          fontSize: 8,
          margin: [0, 50, 0, 10]
        },
      }
    };
    pdfMake.createPdf(docDefinition).download(this.SelectedSemester + '_' + CourseDetails.Course_Alias + '.pdf');
  }  
}

