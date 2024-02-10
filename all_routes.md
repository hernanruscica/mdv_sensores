Estas son todas las rutas y en que archivos se encuentran

<!-- IndexRoutes.js -->
router.get('/', IndexController.home);
router.get('/loginform',  IndexController.loginForm );

<!-- UserRoutes.js -->
router.post('/update', UserController.update);
router.get('/register',  UserController.registerForm );
router.get('/editform/:dni',  UserController.editForm );
router.post('/add', UserController.add);
router.get('/activate/:userToken', UserController.activate);
router.post('/setPassword/:userToken', UserController.setPassword);
router.post('/authenticate', UserController.authenticate);
router.get('/dashboard', UserController.dashboard);
router.get('/profile', UserController.profile);
router.get('/logout', UserController.logout);
router.get('/all', UserController.getAll);
router.delete('/:dni', UserController.deleteByDni);
router.get('/view/:dni', UserController.viewUser);
router.get('/sendactivation/:dni', UserController.sendActivation);

<!-- DataloggerRoutes.js -->
router.get('/view/:id', DataloggerController.viewDatalogger);
 router.get('/view/:id/channels/:idchannel', DataloggerController.viewChannel);

<!-- UploadRoutes.js -->
// Ruta principal
router.get('/', (req, res) => {res.render('uploadImageForm');});  
// Ruta para manejar la carga de imágenes y datos adicionales
router.post('/', upload.single('image'), UploadController.UploadImage);


<!-- LocationRoutes.js -->
router.get('/all', LocationController.getAll);
router.get('/view/:id', LocationController.viewLocation);

