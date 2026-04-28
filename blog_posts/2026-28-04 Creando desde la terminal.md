---
title: Creando desde la terminal
date: 2026-04-28
summary: Cómo uso terminal, Claude Code, worktrees, tmux y scripting para convertir tareas repetitivas en flujos de trabajo más sostenibles.
---
{{newthought: Hace un par de años me pasé a nvim}}, antes de que existieran cosas como Opencode o Claude Code. El paso fue porque quería explorar nuevas cosas; siempre me ha apasionado el homelabbing y nvim era una manera de acercarme mas al homelabbing en la PC. Pasé por muchos IDEs, VsCode por supuesto, Rubymine y otros, sin embargo, sentía que había algo que no tenían: simplicidad.

Actualmente tenemos herramientas en terminal que realmente hacen casi todo nuestro trabajo: escribir código, analizar propuestas, etc. Además, se impulsa el uso continuo del agente. Como resultado de esa búsqueda de que el agente sea más independiente, aprenda y cada día pueda ser más oneshot, la terminal adquirió un papel aún más protagónico del que ya tenía.

En el resto del texto exploraremos [Review Inator](https://github.com/nedzib/review-inator), una implementación muy sencilla que potencia el uso tanto de la terminal como de Claude Code.

## Scripting y Claude Code
Hace poco veía un video de Nate Gentile en donde colocaba una webcam viendo una pared donde estaba Claude Code arreglando el blending de dos videobeams con la instrucción de que Claude se realimentara tomando capturas de la webcam. Eso me pareció una genialidad; más que la acción en sí misma, porque me recordó que literalmente podemos hacer cualquier cosa. {{mn: A veces nosotros mismos nos ponemos límites sin querer, al vivir el día a día pensando solo en cómo entregar lo que necesitamos en lugar de cómo hacer que mi trabajo sea más fácil.}}

Entonces me puse a pensar qué cosas necesito hackear yo en la vida, y de ahí nace Review Inator. Un día usando Claude Code salieron 10 PR de repente que agregaban documentación en distintos archivos. Evidentemente, al requerir una revisión de al menos alguien de mi equipo, lanzar 10 de una sola vez era sobrecargarlos de revisiones.

Eso sería una normalidad. Dado que con Claude Code podemos automatizar cosas como documentación, ofensas de linters, etc., tendríamos un problema de revisiones. Review Inator lo que hace es muy simple: setea, en este caso, un archivo plist que ejecuta un script cada cierto tiempo. El script busca si te han asignado un PR y, en cuyo caso, crea un worktree para la revisión, una sesión de tmux {{mn: Tanto worktrees como tmux los veremos en el siguiente subtítulo.}}, y luego en esa sesión abre una instancia de Claude Code con un prompt que no solo revisa el PR, sino que también abre una review pending en el PR dejando los comentarios obtenidos de la revisión.

Review Inator tiene un archivo de configuración donde dejamos los repos que queremos que valide, el tiempo de polling y el prompt que debe correr con Claude.

## Worktrees y Tmux/Jmux
Bueno, ¿qué es un worktree? Es básicamente una copia del repositorio. Vive en una carpeta distinta a la principal, pero comparte el `.git`, y nos sirve para separar los desarrollos en proceso y así trabajar en varias cosas en paralelo. Existe una forma nativa de crearlas con comandos de git, pero puedes por ejemplo personalizar tu propia implementación. Esta es la mía:

```BASH
function wt() {
  emulate -L zsh
  local dir branch branch_exists branch_name session_name worktree_dir

  printf "Nombre del directorio: "
  read dir

  dir=${dir// /_}
  worktree_dir="../$dir"

  if [ -z "$dir" ]; then
    echo "Directorio vacio"
    return 1
  fi

  printf "La rama ya existe? [s/N]: "
  read branch_exists

  if [[ "$branch_exists:l" == "s" ]]; then
    branch=$(git for-each-ref --format="%(refname:short)" refs/heads refs/remotes | grep -v '/HEAD$' | fzf --prompt="Selecciona rama: ")

    if [ -z "$branch" ]; then
      echo "No seleccionaste rama"
      return 1
    fi
  else
    printf "Nombre de la rama nueva: "
    read branch_name

    if [ -z "$branch_name" ]; then
      echo "Rama vacia"
      return 1
    fi

    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
      echo "La rama local ya existe"
      return 1
    fi

    git branch "$branch_name" master || return 1
    branch="$branch_name"
  fi

  git worktree add "$worktree_dir" "$branch" || return 1

  session_name=$(basename "$worktree_dir")
  session_name=${session_name//[^[:alnum:]_-]/_}

  if ! tmux has-session -t "$session_name" 2>/dev/null; then
    tmux new-session -d -s "$session_name" -c "$worktree_dir"
  fi
}
```

Aquí básicamente seleccionamos el nombre del directorio y la rama; esta última si existe, y si no, pregunta el nombre de la rama. Acto seguido, creamos una sesión de tmux allí.

{{newthought: Mi obsesion por tmux}} viene de su uso combinado con [jmux](https://www.jmux.build/) este ultimo te ayuda a gestionar tus sesiones de tmux en un sidebar y viene con funciones adicionales para manejar tus worktrees, solo que al ser posible me gusta siempre personalizar los scripts y herramientas a mis particulares casos de uso.

![jmux](./assets/blog/jmux.png)

Entonces, cada vez que Review Inator abre una review que me asignaron y cada vez que abro un worktree con mi comando, me aparece mágicamente en Jmux listo para continuar.

Eliminar un worktree también era toda una situación. Intenté hacer uso de [wtm](https://github.com/jarredkenny/worktree-manager) para gestionar los worktrees, pero al intentar eliminar tenía que tipear el nombre del worktree sin ninguna guía de cuáles tenía, ya que al oprimir tab solo listaba archivos del proyecto. En ese sentido busqué una solución nuevamente en el scripting.

```BASH
function wtd() {
  local wt
  wt=$(git worktree list | awk '{print $1}' | xargs -n1 basename | fzf --prompt="Select worktree to delete:") || return
  [ -n "$wt" ] && wtm delete "$wt" --force
}
```

Es tremendamente sencillo: solo saco la lista de los worktrees, la paso por fzf y luego, al seleccionar uno, se la pasamos como parámetro al comando de eliminar. Con eso no tengo que pensar cuál era el nombre del worktree, {{mn: Es útil sobre todo porque en mi caso de uso algunos nombres vienen formateados tipo \<pr_number\>_\<pr_author\> y esto provoca que recordarlos sea más complicado.}} solo seleccionarlo.

### Conclusion
Al final, lo que más me interesa de la terminal no es nostalgia ni minimalismo. Es la posibilidad de convertir tareas repetitivas en sistemas pequeños, propios y adaptados a mi manera de trabajar. A veces eso toma la forma de un script, a veces de un worktree, a veces de una sesión de tmux. Lo importante es que, poco a poco, el entorno deja de ser solo una herramienta y empieza a convertirse en una extensión real del criterio con el que trabajamos.
