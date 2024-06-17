const core = require('@actions/core');
const io = require('@actions/io');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const fs = require('fs');

async function main() {
  const millScriptPath = '.mill-bin'

  try {
    const defaultMillVersion = core.getInput('default-mill-version');
    const userMillVersion = core.getInput('mill-version');
    core.exportVariable('DEFAULT_MILL_VERSION', defaultMillVersion);
    if (userMillVersion === '-1') {
      core.exportVariable('MILL_VERSION', userMillVersion);
    }

    // var millVersion = defaultMillVersion;
    // if (userMillVersion === '-1') {
    //   millVersion = userMillVersion;
    // } else {
    //   if (fs.existsSync(".mill-version")) {
    //     millVersion = fs.readFileSync(".mill-version").split('\n')[0].trim();
    //   } else if (fs.existsSync(".config/mill-version")) {
    //     millVersion = fs.readFileSync(".config/mill-version").split('\n')[0].trim();
    //   }
    // }

    var millBinaryCachedPath = tc.find('millBinary', "0");
    if (millBinaryCachedPath) {
      core.info(`millBinaries found in cache ${millBinaryCachedPath}`);
    }

    var millScriptCachedPath = tc.find('millScript', defaultMillVersion);
    if (millScriptCachedPath) {
      core.info(`millScript found in cache ${millScriptCachedPath}`);
    } else {
      const millScriptDownloadPath = await tc.downloadTool(`https://github.com/lihaoyi/mill/releases/download/${defaultMillVersion}/${defaultMillVersion}`);
      await io.mkdirP(millScriptPath);
      await io.cp(millScriptDownloadPath, `${millScriptPath}/mill`, { force: true });
      fs.chmodSync(`${millScriptPath}/mill`, '0755');
      millScriptCachedPath = await tc.cacheDir(millScriptPath, 'millScript', defaultMillVersion);
    }
    core.addPath(millScriptCachedPath);

    await exec.exec('mill', ['version']);

    await tc.cacheDir(millBinaryCachedPath, 'millBinary', "0")
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
