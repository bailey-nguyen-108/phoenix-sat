# Phoenix Product Specification

Version: Draft 0.1  
Date: 2026-05-08  
Source: `Cost Est-SAT-Prep-Phase1-2026-04-16-1312.xlsx`, sheet `V1`  
Scope: Phase 1 — Student Core

## 1. Summary

Phoenix is a SAT prep platform for students and administrators.

Phase 1 focuses on:

- Student registration, login, profile, dashboard, and practice sessions.
- MCQ question-taking, scoring, results, and weak sub-topic follow-up.
- Admin question bank management.
- AI-generated question drafts and admin review before publication.
- English answer explanations.
- Cloud deployment with staging and production environments.

## 2. Roles

### Student

Uses Phoenix to practice SAT questions, review performance, and track weak sub-topics.

### Admin

Manages questions, reviews AI-generated drafts, approves content, and views subscription status.

## 3. Scope

### In Scope

- Email/password registration and login.
- Password reset by email.
- Student profile with name, email, and subscription status.
- Admin and Student role separation.
- Question bank with MCQ questions.
- Subject, difficulty, and sub-topic tagging.
- Admin question CRUD, filters, and keyword search.
- AI-generated question review queue.
- Student session setup.
- MCQ answering, feedback, scoring, and results.
- Weak sub-topic follow-up logic using a 70% threshold.
- AI-generated English explanations for wrong answers.
- Student dashboard summary widgets.
- Backend API, PostgreSQL database, CI/CD, staging, and production deployment.

### Out Of Scope

- Social login, SSO, and 2FA.
- Profile photos or social/community features.
- More than two roles.
- Custom role builder.
- Fill-in-blank or free-response questions.
- Multi-select MCQ answers.
- Changing an answer after submission.
- Pause/resume across sessions.
- Question version history.
- Semantic or AI-assisted search.
- Mid-session adaptive follow-up.
- Vietnamese explanations.
- Detailed analytics charts.

## 4. Epics And User Stories

## Epic 1: Authentication And Access

Goal: Let students and admins access the correct Phoenix experience securely.

### Story 1.1: Student Registration And Login

As a student, I want to register and log in with email/password so I can access my practice account.

Acceptance criteria:

- Student can register with email and password.
- Student can log in with email and password.
- Student remains signed in through session management.
- Student can request a password reset email.
- Protected student screens require authentication.

Constraints:

- No social login.
- No SSO.
- No 2FA.

### Story 1.2: Role-Based Access

As Phoenix, I need to separate Admin and Student access so each role only sees permitted features.

Acceptance criteria:

- Student can access learning features only.
- Admin can access admin features.
- Student cannot access admin routes or APIs.
- Admin accounts are created directly in the system.

Constraints:

- Two roles only: Admin and Student.
- No custom role builder.

## Epic 2: Student Profile

Goal: Let students view and manage basic account information.

### Story 2.1: View Profile

As a student, I want to view my profile so I can confirm my account and subscription information.

Acceptance criteria:

- Profile shows student name.
- Profile shows email.
- Profile shows subscription status.
- Basic account settings are available.

Constraints:

- No profile photo upload.
- No social features.

## Epic 3: Question Bank

Goal: Give admins a reliable way to manage SAT question content.

### Story 3.1: Question Data Model

As an admin, I need every question to follow a consistent MCQ structure so questions can be used in practice sessions.

Acceptance criteria:

- Each question has a subject: Math or Reading & Writing.
- Each question has a difficulty: Easy, Medium, or Hard.
- Each question has at least one sub-topic tag.
- Each question has answer choices.
- Each question has exactly one correct answer.
- Each question can store a rationale/explanation.

Constraints:

- MCQ only.
- Fill-in-blank and free-response are out of scope.

### Story 3.2: Manage Questions

As an admin, I want to add, edit, delete, filter, and search questions so I can maintain the question bank.

Acceptance criteria:

- Admin can create a question.
- Admin can edit question text, answers, correct answer, difficulty, subject, sub-topic, and rationale.
- Admin can delete questions.
- Admin can filter by subject, difficulty, sub-topic, and review status.
- Admin can search by keyword across question content and sub-topic tags.

Constraints:

- Admin edits only.
- No version history.
- Keyword search only.
- No semantic search.

## Epic 4: AI Question Workflow

Goal: Use AI to speed up content creation while keeping admins in control.

### Story 4.1: Generate AI Questions

As an admin, I want to generate question drafts by subject, difficulty, and quantity so I can create content faster.

Acceptance criteria:

- Admin can select subject.
- Admin can select difficulty.
- Admin can select quantity.
- Generated questions route to the review queue.
- Generated questions are not visible to students until approved.

Constraints:

- Uses client GCP project and Vertex AI credentials.
- AI API costs are billed directly to the client by Google.

### Story 4.2: Review AI Questions

As an admin, I want to approve, edit, or reject AI-generated questions so only reviewed content goes live.

Acceptance criteria:

- Admin can view pending AI-generated questions.
- Admin can approve a question.
- Admin can edit before approval.
- Admin can reject a question.
- Approved questions enter the live pool.
- Rejected questions do not enter the live pool.

Constraints:

- All AI-generated questions require manual review.
- No auto-approval.

### Story 4.3: AI Answer Explanations

As a student, I want explanations for wrong answers so I understand what to improve.

Acceptance criteria:

- AI explanation is generated in English.
- Explanation is stored with the approved question.
- Student can see explanations after a session.
- Admin can edit explanations.

Constraints:

- English only.
- Vietnamese translation is Phase 2.

## Epic 5: Student Practice Sessions

Goal: Let students configure and complete focused SAT practice sessions.

### Story 5.1: Configure Practice Session

As a student, I want to choose subject, sub-topics, difficulty, and question count so I can practice intentionally.

Acceptance criteria:

- Student can choose Math or Reading & Writing.
- Student can choose one or more sub-topics.
- Selected sub-topic count cannot exceed question count.
- Student can choose Easy, Medium, or Hard.
- Student can choose question count.
- Student can start the session.
- If no sub-topic is selected, Phoenix can pull from any eligible sub-topic for the selected subject.

Constraints:

- MCQ sessions only.
- No pause/resume in Phase 1.

### Story 5.2: Answer MCQs

As a student, I want to answer one MCQ at a time so the practice flow feels focused and test-like.

Acceptance criteria:

- Student sees one question at a time.
- Student can select one answer.
- Student can submit the answer.
- Phoenix scores the answer.
- Phoenix shows Good / OK / Bad feedback.
- Student cannot change the answer after submission.

Constraints:

- No multi-select MCQs.
- No answer changes after submission.

### Story 5.3: View Results

As a student, I want to review my session results so I know how I performed and what to practice next.

Acceptance criteria:

- Student sees session-end score summary.
- Student sees answer review.
- Student sees missed questions and explanations where available.
- Student sees suggested next practice based on weak areas.

## Epic 6: Weak Sub-Topic Follow-Up

Goal: Help students improve weak areas over time.

### Story 6.1: Identify Weak Sub-Topics

As Phoenix, I need to identify sub-topics below 70% so follow-up sessions can target weaknesses.

Acceptance criteria:

- Phoenix calculates performance by sub-topic after a session.
- Sub-topics below 70% are marked weak.
- Weak sub-topics appear in later practice recommendations.

Constraints:

- Trigger happens after session completion only.
- No mid-session adaptation.

### Story 6.2: Queue Follow-Up Practice

As a student, I want Phoenix to bias future practice toward weak sub-topics until I improve.

Acceptance criteria:

- Phoenix queues follow-up questions for weak tags.
- Follow-up continues until the student reaches at least 70% for that tag.
- Follow-up for each weak sub-topic is capped at 20 attempted follow-up questions.
- If the student reaches 70% before the cap, Phoenix stops prioritizing that sub-topic.
- If the student reaches the 20-question cap and remains below 70%, Phoenix marks the sub-topic as needing review instead of forcing more repeated questions.
- Progress is tracked per tag over time.

Constraints:

- Follow-up questions must be admin-approved before entering the pool.
- Availability depends on question bank depth.
- The 20-question cap is configurable and must be confirmed with the client.

## Epic 7: Student Dashboard

Goal: Give students a quick overview of progress and the next best action.

### Story 7.1: View Dashboard

As a student, I want a dashboard so I can see progress and quickly start practice.

Acceptance criteria:

- Dashboard shows sessions completed.
- Dashboard shows streak.
- Dashboard shows weak sub-topics.
- Dashboard shows score snapshot.
- Dashboard has quick launch into a new practice session.

Constraints:

- Summary widgets only.
- Detailed analytics charts are Phase 2.

## Epic 8: Subscription Management

Goal: Show subscription status in Phase 1 and give admins basic visibility.

Phase 1 subscription rule:

- There is no payment flow in Phase 1.
- Subscription is display-only.
- Every student is shown as being on the Pro plan.

### Story 8.1: Student Subscription Status

As a student, I want to see my subscription status so I know whether my account is active.

Acceptance criteria:

- Student profile shows the student as Pro.
- Subscription status is readable.
- No payment, checkout, billing, upgrade, downgrade, or cancellation flow is shown to students.

### Story 8.2: Admin Subscription View

As an admin, I want to view subscription information so I can support students.

Acceptance criteria:

- Admin can access subscription management screen.
- Admin can view student subscription status.
- Admin can view every student as Pro.
- Admin can view key subscription details such as plan and member since.

Constraints:

- No payment provider integration in Phase 1.
- No billing management in Phase 1.
- No checkout, invoice, cancellation, renewal, upgrade, or downgrade workflow in Phase 1.

## Epic 9: Platform And Deployment

Goal: Deploy Phoenix as a reliable web platform with staging and production environments.

### Story 9.1: Backend And Database

As Phoenix, I need backend APIs and a database so student, admin, session, and question data persists reliably.

Acceptance criteria:

- RESTful Go API supports Phase 1 workflows.
- PostgreSQL 15 schema exists with migrations.
- API enforces role boundaries.

### Story 9.2: Cloud Deployment

As the project team, we need staging and production deployments so Phoenix can be tested and launched safely.

Acceptance criteria:

- Cloud Run hosts backend API.
- Cloud SQL hosts PostgreSQL.
- Cloud CDN delivers frontend.
- CI/CD pipeline exists.
- Staging environment exists.
- Production environment exists.
- Deployment region is `asia-southeast1`.

Constraints:

- Client must provide GCP project with billing enabled by Day 1.
- Vertex AI API must be active by Day 1.
- Hosting costs are billed directly by Google.

## 5. Third-Party Services

| Service | Purpose | Estimate / Constraint |
| --- | --- | --- |
| Vertex AI / Gemini | AI question generation and answer explanations | Usage-based, approximately `$10–30/month`; billed to client by Google |
| Cloud Run + Cloud SQL + Cloud CDN | Backend hosting, database, frontend delivery | Approximately `$35–85/month`; client owns GCP project |
| Firebase Auth | Email/password auth, sessions, role claims | Free to usage-based; free tier expected for Phase 1 scale |
| SendGrid | Password resets and system notifications | Free to approximately `$20/month` |

## 6. Delivery Assumptions

- Requirements/BRS: 1 week after kickoff.
- Development and functional testing: 4 weeks after BRS.
- UAT: 1 week after development.
- Go-live: 1 week after UAT.
- Warranty: 1 week after go-live.
- UI/UX feedback includes one round only.
- UI/UX feedback must be provided within 2 business days of design delivery.
- SAT question seed data, or approval for AI-generated seed batch, is required by start of Week 2.

## 7. Change Control

- Requirements must be reviewed and signed off before development.
- Changes after sign-off are treated as change requests.
- Additional UI/UX revision rounds are billed separately.
- Out-of-scope features require separate estimation and approval.

## 8. Open Questions

- Who creates admin accounts in production?
- What seed question bank size is required for launch?
- What final SAT sub-topic hierarchy should Phoenix use?
- Confirm whether the follow-up cap should remain 20 attempted questions per weak sub-topic or use a different configurable value.
- Should AI-generated questions store prompt/model/reviewer audit metadata in Phase 1?
- How exactly should Good / OK / Bad feedback be calculated?
- What final score format should appear in results?

## 9. Phase 1 Launch Checklist

- Requirements signed off.
- Student auth implemented.
- Admin/student access enforced.
- Student profile implemented.
- Student dashboard implemented.
- Session setup implemented.
- MCQ flow implemented.
- Results and answer review implemented.
- Question bank CRUD implemented.
- Question filters and keyword search implemented.
- AI generation implemented.
- AI review queue implemented.
- Admin-editable rationales implemented.
- Weak sub-topic follow-up implemented.
- Subscription status display implemented.
- Staging deployed.
- Production deployed.
- UAT completed.
- Release notes delivered.
