import * as core from '@actions/core';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';

async function main(): Promise<void> {
  const millPath = '.mill-bin';

  try {
    const millVersion: string = core.getInput('mill-version');

    const millDownloadPath: string = await tc.downloadTool(`https://github.com/lihaoyi/mill/releases/download/${millVersion}/${millVersion}`);
    await io.mkdirP(millPath);
    await io.cp(millDownloadPath, `${millPath}/mill`, { force: true });
    fs.chmodSync(`${millPath}/mill`, '0755');
    core.addPath(millPath);

    await exec.exec('mill', ['version']);
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

main();
