************************************************************
INICIAR EN AWS academy
************************************************************
- Ingresar a AWS academy

https://www.awsacademy.com/vforcesite/LMS_Login
"Student login"

jdcardenal@eafit.edu.co
Jdcl200410*

azul
MODULES
Launch AWS Academy Learner Lab
Start Lab
AWS

************************************************************
CREAR EL CLUSTER Y LOS NODOS DESDE LA CONSOLA DE AWS
************************************************************
## 🏗️ Paso 1: Crear Cluster EKS usando AWS Console

### 📋 Preparación
1. **Abrir AWS Console** desde AWS Academy
2. **Ir a la región us-east-1** (menú superior derecho)
3. **Anotar tu Account ID** (visible en la esquina superior derecha)

### � Paso 1.1: Identificar Roles Pre-existentes en AWS Academy

**AWS Academy ya tiene roles creados que puedes usar. Busca estos roles:**

1. **Ir a IAM Console**: Buscar "IAM" en la barra de búsqueda
2. **Ver Roles existentes**: Clic en "Roles" 
3. **Buscar roles que contengan**:
   - `Lab` o `voclabs` en el nombre
   - Roles con políticas de EKS
   - Ejemplo: `LabRole`, `voclabs`, o similar

4. **Anotar los nombres** de los roles disponibles:
   ```bash
   # Roles típicos en AWS Academy:
   # - LabRole (suele tener permisos amplios)
   # - voclabs (rol principal del usuario)
   # Anota el ARN completo, ejemplo:
   # arn:aws:iam::590184067968:role/LabRole
   ```

### 🚀 Paso 1.2: Crear Cluster EKS (Método Academy)

1. **Ir a EKS Console**: Buscar "EKS" en la barra de búsqueda
2. **Crear cluster**:
   - **Nombre**: `bookstore-eks`
   - **Versión de Kubernetes**: 1.28 (o la más reciente disponible)
   - **Rol de servicio**: Usar `LabRole` o el rol disponible que anotaste
   - Clic "Next"

3. **Configurar red**:
   - **VPC**: Seleccionar la VPC por defecto
   - **Subredes**: Seleccionar TODAS las subredes disponibles
   - **Grupos de seguridad**: Dejar por defecto
   - **Endpoint access**: Público solamente (más simple)
   - Clic "Next"

4. **Configurar logging**: **Deshabilitar todos los logs** (para evitar errores), clic "Next"
5. **Revisar y crear**: Clic "Create"

⏱️ **Esperar 10-15 minutos** hasta que esté "Active"

### 🖥️ Paso 1.3: Configuración de Compute

1. **En el cluster creado**, ir a la pestaña "Compute"
2. **Add node group**:
   - **Nombre**: `bookstore-nodes`
   - **Rol del nodo**: Usar `LabRole` o rol disponible
   - Clic "Next"

3. **Configurar compute**:
   - **AMI type**: Amazon Linux 2 (AL2_x86_64)
   - **Capacity type**: On-Demand
   - **Instance types**: `t3.small` (más económico para Academy)
   - **Disk size**: 20 GiB
   - Clic "Next"

4. **Configurar scaling**:
   - **Desired size**: 2 (reducido para Academy)
   - **Minimum size**: 1
   - **Maximum size**: 2
   - Clic "Next"

5. **Configurar networking**: Usar configuración por defecto, clic "Next"
6. **Revisar y crear**: Clic "Create"

⏱️ **Esperar 5-10 minutos** hasta que esté "Active"

************************************************************
CONFIGURAR EL ENTORNO Y LOGUEARSE EN ECR
************************************************************
export ACCOUNT_ID="590184067968"  # Del AWS Console
export AWS_REGION="us-east-1"
export ECR_REGISTRY="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

Tomar las credenciales desde AWS academy
- Ir a AWS Details
- En AWS CLI optimir show
- Copiar el contenido y pegarlo en el archivo ~/.aws/credentials:
[default]
aws_access_key_id=ASIAYS2NWGOACXES3YMB
aws_secret_access_key=xxx
aws_session_token=yyyy
(o hacerlo con aws configure)

Si es necesario configurar tambien la región (us-east-1)

# Autenticarse con ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Configurar KubeCtl
aws eks update-kubeconfig --region us-east-1 --name bookstore-eks
kubectl get namespaces
kubectl get nodes
kubectl get pods --all-namespaces

************************************************************
CONSTRUIR Y DESPLEGAR
************************************************************
# user-service
# Construye imagen y la sube
cd user-service
docker buildx build --platform linux/amd64 -t user-service:latest .
docker tag user-service:latest $ECR_REGISTRY/user-service:latest
docker push $ECR_REGISTRY/user-service:latest
cd ..
# Crea el contenedor usando la imagen
cd k8s
kubectl delete -f 04-user-service.yaml
kubectl get pods --all-namespaces
kubectl apply -f 04-user-service.yaml
kubectl get pods --all-namespaces
kubectl logs -l app=user-service -n bookstore  
kubectl describe pod -l app=user-service -n bookstore

# catalog-service (repetir los mismos)
# Construye imagen y la sube
cd catalog-service
docker buildx build --platform linux/amd64 -t catalog-service:latest .
docker tag catalog-service:latest $ECR_REGISTRY/catalog-service:latest
docker push $ECR_REGISTRY/catalog-service:latest
cd ..
# Crea el contenedor usando la imagen
cd k8s
kubectl delete -f 05-catalog-service.yaml
kubectl get pods --all-namespaces
kubectl apply -f 05-catalog-service.yaml
kubectl get pods --all-namespaces
kubectl logs -l app=catalog-service -n bookstore  
kubectl describe pod -l app=catalog-service -n bookstore

# notification-service (repetir los mismos cambiando el nombre)
cd notification-service
docker buildx build --platform linux/amd64 -t notification-service:latest .
docker tag notification-service:latest $ECR_REGISTRY/notification-service:latest
docker push $ECR_REGISTRY/notification-service:latest
cd ..
# Crea el contenedor usando la imagen
cd k8s
kubectl delete -f 07-notification-service.yaml (Solo si se desean eliminar los pods previos)
kubectl get pods --all-namespaces
kubectl apply -f 07-notification-service.yaml
kubectl get pods --all-namespaces
kubectl logs -l app=notification-service -n bookstore
kubectl describe pod -l app=notification-service -n bookstore

# cart-service (repetir los mismos cambiando el nombre)
# Construye imagen y la sube
cd cart-service
docker buildx build --platform linux/amd64 -t cart-service:latest .
docker tag cart-service:latest $ECR_REGISTRY/cart-service:latest
docker push $ECR_REGISTRY/cart-service:latest
cd ..
# Crea el contenedor usando la imagen
cd k8s
kubectl delete -f 06-cart-service.yaml (Solo si se desean eliminar los pods previos)
kubectl get pods --all-namespaces
kubectl apply -f 06-cart-service.yaml
kubectl get pods --all-namespaces
kubectl logs -l app=cart-service -n bookstore
kubectl describe pod -l app=cart-service -n bookstore

# frontend (repetir los mismos cambiando el nombre) - Ojo - el nombre del repo es bookstore-frontend
# Construye imagen y la sube
cd frontend
docker buildx build --platform linux/amd64 -t bookstore-frontend:latest .
docker tag bookstore-frontend:latest $ECR_REGISTRY/bookstore-frontend:latest
docker push $ECR_REGISTRY/bookstore-frontend:latest
cd ..
# Crea el contenedor usando la imagen
cd k8s
kubectl delete -f 08-frontend.yaml (Solo si se desean eliminar los pods previos)
kubectl get pods --all-namespaces
kubectl apply -f 08-frontend.yaml
kubectl get pods --all-namespaces
kubectl logs -l app=frontend -n bookstore
kubectl describe pod -l app=frontend -n bookstore

# Crea los nodeports por cada servicio incluyendo el front
kubectl delete -f nodeport-services.yaml
kubectl apply -f nodeport-services.yaml
kubectl get services -n bookstore

kubectl get nodes -o wide
kubectl get services -n bookstore | grep NodePort

************************************************************
CREAR ALB (APPLICATION LOAD BALANCER)
************************************************************
Ir a EC2 Console
AWS Console → EC2 → Load Balancers
Create Load Balancer
Application Load Balancer → Create

4.2: Configuración Básica

Name: bookstore-alb
Scheme: Internet-facing
IP address type: IPv4

4.3: Network Mapping
VPC: Seleccionar la VPC de tu cluster EKS
Mappings: Seleccionar todas las zonas de disponibilidad
Subnets: Seleccionar las subredes públicas
4.4: Security Groups
Crear nuevo Security Group o usar uno existente con reglas:

ESTO ES MUY IMPORTANTE
HTTP (80): 0.0.0.0/0HTTPS (443): 0.0.0.0/0 (opcional)Custom TCP (30001-30080): Desde las subredes del cluster
4.5: Listeners and Routing
Listener 1 - Frontend (Puerto 80):


Protocol: HTTPPort: 80Default action: Forward to → Crear nuevo Target Group
Target Group para Frontend:


Name: bookstore-frontend-tgTarget type: InstancesProtocol: HTTPPort: 30080VPC: [tu-vpc]Health check path: /
🎯 Paso 5: Configurar Target Groups
Para cada servicio, crea un Target Group:

Frontend Target Group:

Name: bookstore-frontend-tgPort: 30080Health check: /
User Service Target Group:

Name: bookstore-user-tg  Port: 30002Health check: /health
Catalog Service Target Group:

Name: bookstore-catalog-tgPort: 30001Health check: /health
Cart Service Target Group:

Name: bookstore-cart-tgPort: 30004Health check: /health
Notification Service Target Group:

Name: bookstore-notification-tgPort: 30003Health check: /health
🔧 Paso 6: Configurar Routing Rules
Después de crear el ALB, agrega Listener Rules:

# Validar problemas

# Probar acceso directo al NodePort desde dentro del cluster
kubectl run test-pod --image=busybox -n bookstore --rm -it --restart=Never -- sh

# Dentro del pod de prueba:
nc -zv frontend-service 30080

wget -qO- http://frontend-service:30080 || echo "Failed"
wget -qO- http://user-service-nodeport:5002/health || echo "Failed"
wget -qO- http://user-service-nodeport:30002 || echo "Failed"

# Salir del pod
exit

usuario: cliente@test.com
clave: 123456