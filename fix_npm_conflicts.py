
import subprocess
import sys

def run(cmd):
    print(f"$ {cmd}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        sys.exit(result.returncode)

if __name__ == "__main__":
    # Remove dnd-kit conflitantes
    run("npm uninstall @dnd-kit/core @dnd-kit/sortable")
    # Instala versões compatíveis
    run("npm install @dnd-kit/core@7.0.2 @dnd-kit/sortable@7.0.2")
    # Tenta instalar dependências restantes normalmente
    run("npm install")
    print("Conflitos dnd-kit resolvidos e dependências instaladas com sucesso.")
