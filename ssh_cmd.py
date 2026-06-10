import sys
import subprocess

try:
    import paramiko
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'paramiko'])
    import paramiko

def run_remote(command):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect('10.10.200.34', username='root', password='Dda5a3d52a#9230', timeout=10)
    stdin, stdout, stderr = ssh.exec_command(command)
    
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    if out:
        print("STDOUT:")
        print(out)
    if err:
        print("STDERR:")
        print(err)
        
    ssh.close()

if __name__ == '__main__':
    run_remote(sys.argv[1])
