{{/*
Nombre corto del chart (web).
*/}}
{{- define "web.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{/*
Nombre completo de los recursos: <release>-web. El nombre de "release" es el
que se le da al `helm install <release> ...`; permite instalar el mismo chart
varias veces en el clúster sin que los nombres choquen. Si el release ya se
llama igual que el chart (el caso normal aquí, ej. `helm install web chart/`),
no se duplica el nombre.
*/}}
{{- define "web.fullname" -}}
{{- if eq .Release.Name .Chart.Name -}}
{{- .Chart.Name -}}
{{- else -}}
{{- .Release.Name -}}-{{- .Chart.Name -}}
{{- end -}}
{{- end -}}

{{/*
Etiquetas comunes que se añaden a todos los recursos (buena práctica estándar
de Kubernetes/Helm para poder filtrar `kubectl get pods -l app.kubernetes.io/name=web`).
*/}}
{{- define "web.labels" -}}
app.kubernetes.io/name: {{ include "web.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/*
Subconjunto de etiquetas usado en el selector del Deployment/Service: deben ser
estables (no cambiar entre releases), por eso van aparte de "labels".
*/}}
{{- define "web.selectorLabels" -}}
app.kubernetes.io/name: {{ include "web.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
