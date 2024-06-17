const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const fs = require('fs');

async function main() {
  const millPath = '.mill-bin'

  try {
    const millVersion = core.getInput('mill-version');

    const millDownloadPath = await tc.downloadTool(`https://github.com/lihaoyi/mill/releases/download/${millVersion}/${millVersion}`);
    await io.mkdirP(millPath);
    await io.cp(millDownloadPath, `${millPath}/mill`, { force: true });
    fs.chmodSync(`${millPath}/mill`, '0755');
    core.addPath(millPath);

    await exec.exec('mill', ['version']);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
