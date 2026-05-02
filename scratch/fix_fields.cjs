const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/user\.id/g, 'user._id');
  content = content.replace(/task\.id/g, 'task._id');
  content = content.replace(/p\.id/g, 'p._id');
  content = content.replace(/u\.id/g, 'u._id');
  content = content.replace(/m\.id/g, 'm._id');
  content = content.replace(/project\.id/g, 'project._id');
  content = content.replace(/taskId/g, 'taskId'); // just in case
  
  content = content.replace(/projectId/g, 'project');
  content = content.replace(/assignedTo_MemberId/g, 'assignedTo');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
