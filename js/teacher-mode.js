/* ═══════════════════════════════════════════
   SDR KIDS LAB — TEACHER & PARENT MODE v1.0.0
   ═══════════════════════════════════════════ */

const SDRTeacherMode = (() => {

  function renderDashboard() {
    const role = SDRSettings.get('role');
    const stats = SDRProgress.getStats();
    const isTeacher = role === 'teacher';

    return `
      <div class="teacher-dash">
        <h2 class="teacher-dash__title">${isTeacher ? '👩‍🏫 Teacher Dashboard' : '👨‍👩‍👧 Parent Dashboard'}</h2>
        
        <div class="teacher-dash__summary">
          <div class="teacher-dash__card">
            <h3>📊 Student Overview</h3>
            <div class="teacher-dash__stat-row">
              <span>Progress:</span>
              <strong>${stats.modulesViewed} / ${stats.modulesTotal} modules (${stats.percentComplete}%)</strong>
            </div>
            <div class="teacher-dash__stat-row">
              <span>Current Level:</span>
              <strong>⭐ ${stats.level} — ${stats.levelTitle}</strong>
            </div>
            <div class="teacher-dash__stat-row">
              <span>Total XP:</span>
              <strong>${stats.xp} XP</strong>
            </div>
            <div class="teacher-dash__stat-row">
              <span>Quiz Accuracy:</span>
              <strong>${stats.quizAccuracy}% (${stats.quizCorrect}/${stats.quizAttempted})</strong>
            </div>
            <div class="teacher-dash__stat-row">
              <span>Badges Earned:</span>
              <strong>${stats.badges.length} / ${stats.badgesTotal}</strong>
            </div>
            <div class="teacher-dash__stat-row">
              <span>First Visit:</span>
              <strong>${stats.firstVisit ? new Date(stats.firstVisit).toLocaleDateString() : 'N/A'}</strong>
            </div>
            <div class="teacher-dash__stat-row">
              <span>Last Activity:</span>
              <strong>${stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : 'N/A'}</strong>
            </div>
          </div>
        </div>

        <h3>📋 Module Completion Map</h3>
        <div class="teacher-dash__modules">
          ${SDRModules.getAll().map(m => {
            const prog = stats.modulesViewed > 0 ? '✅' : '⬜';
            return `<div class="teacher-dash__module-row">
              <span class="teacher-dash__module-num">${m.num}</span>
              <span class="teacher-dash__module-name">${m.icon} ${m.name}</span>
              <span class="teacher-dash__module-status">${prog}</span>
            </div>`;
          }).join('')}
        </div>

        ${isTeacher ? `
        <h3>🎯 Teaching Recommendations</h3>
        <div class="teacher-dash__card">
          ${stats.percentComplete < 30 ? `
            <p>📌 <strong>Getting Started:</strong> The student is in the early stages. Focus on Modules 0-3 (theory foundation) before moving to hands-on hardware.</p>
            <p>💡 Tip: Start at 🟢 Newb level. The analogies and visual examples help build intuition before introducing technical terms.</p>
          ` : stats.percentComplete < 70 ? `
            <p>📌 <strong>Building Skills:</strong> Good progress! The student has a foundation. Time to introduce hardware labs (Modules 7-10).</p>
            <p>💡 Tip: If quiz accuracy is below 70%, review earlier modules before advancing. Try switching to 🟡 Explorer level for more depth.</p>
          ` : `
            <p>📌 <strong>Advanced Stage:</strong> Excellent progress! The student is ready for signal decoding and project work.</p>
            <p>💡 Tip: Encourage the Final Project (Module 14) and consider 🔴 Developer level for interested students. The challenges are designed for self-directed exploration.</p>
          `}
        </div>

        <h3>📝 Suggested Activities</h3>
        <div class="teacher-dash__card">
          <p><strong>Classroom:</strong> Modules 0-6 can be taught as a 7-session course (1 module per session, 45-60 min each).</p>
          <p><strong>Lab Session:</strong> Modules 7-10 work best as hands-on 90-minute workshops with actual hardware.</p>
          <p><strong>Group Project:</strong> Module 14 (Final Project) is designed for team-based SDR station building.</p>
          <p><strong>Assessment:</strong> Each module has 2-3 quiz questions per level. The challenges serve as homework/portfolio pieces.</p>
        </div>

        <h3>📄 Printable Worksheets</h3>
        <div class="teacher-dash__card">
          <p>Each module has a printable worksheet with fill-in-the-blank, diagram drawing, and short answer questions.</p>
          <div class="teacher-dash__worksheets">
            ${SDRModules.getAll().map(m => {
              const num = String(m.num).padStart(2, '0');
              return `<a href="worksheets/worksheet-${num}.html" target="_blank" class="teacher-dash__ws-link">${m.icon} M${m.num}: ${m.name}</a>`;
            }).join('')}
          </div>
          <p style="margin-top:0.75rem"><strong>Answer Keys:</strong></p>
          <div class="teacher-dash__worksheets">
            ${SDRModules.getAll().map(m => {
              const num = String(m.num).padStart(2, '0');
              return `<a href="worksheets/answer-key-${num}.html" target="_blank" class="teacher-dash__ws-link teacher-dash__ws-link--key">🔑 M${m.num}</a>`;
            }).join('')}
          </div>
        </div>
        ` : `
        <h3>🏠 Parent Guide</h3>
        <div class="teacher-dash__card">
          <p>SDR Kids Lab is designed to be <strong>safe and educational</strong>. All reception activities (RTL-SDR) are passive — your child cannot transmit or interfere with any radio systems.</p>
          <p>Module 13 (Security & Ethics) teaches responsible radio use and legal awareness.</p>
          <p><strong>Hardware budget:</strong> An RTL-SDR dongle costs ~$25 and provides hundreds of hours of hands-on learning.</p>
          <p><strong>Privacy:</strong> All data stays on this device. Nothing is sent to any server.</p>
        </div>
        `}

        <div class="teacher-dash__actions">
          <button class="btn btn--outline" onclick="SDRSettings.exportData()">📤 Export Progress</button>
          <button class="btn btn--outline" id="print-report-btn">🖨️ Print Report</button>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const printBtn = document.getElementById('print-report-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  return { renderDashboard, attachEvents };
})();
