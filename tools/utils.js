import { execSync } from 'child_process'
import { get } from 'app-root-dir'

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: get() })
}
