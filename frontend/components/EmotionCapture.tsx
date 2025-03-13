import React, { useState, useEffect } from 'react';

const EmotionCapture = ({ onEmotionDetected }) => {
  const [status, setStatus] = useState('initializing'); // 'initializing', 'mounted', 'camera-active', 'processing', 'error'
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [countdown, setCountdown] = useState(10);
  const [imageData, setImageData] = useState(null);
  
  // Fonction utilitaire pour ajouter des messages de journal
  const log = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  // Fonction qui crée/configure les éléments DOM de manière impérative
  const setupCameraElements = () => {
    log('Configuration des éléments DOM...');
    
    // S'assurer que nous sommes côté client
    if (typeof window === 'undefined') {
      log('Exécution côté serveur, attente du client...');
      return null;
    }
    
    // Trouver ou créer le conteneur pour les éléments de caméra
    let container = document.getElementById('camera-container');
    if (!container) {
      log('Conteneur non trouvé, création...');
      return null;
    }
    
    // Nettoyer le conteneur
    container.innerHTML = '';
    
    // Créer l'élément vidéo
    const videoElement = document.createElement('video');
    videoElement.id = 'camera-video';
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.muted = true;
    videoElement.className = 'w-full rounded-lg';
    
    // Créer le canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'capture-canvas';
    canvasElement.className = 'hidden';
    
    // Créer le conteneur de compte à rebours
    const countdownContainer = document.createElement('div');
    countdownContainer.id = 'countdown-display';
    countdownContainer.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-20';
    countdownContainer.style.display = 'none';
    
    const countdownElement = document.createElement('div');
    countdownElement.className = 'bg-blue-500 text-white font-bold text-xl p-4 rounded-full h-16 w-16 flex items-center justify-center';
    countdownElement.id = 'countdown-number';
    countdownElement.textContent = '10';
    
    countdownContainer.appendChild(countdownElement);
    
    // Ajouter les éléments au conteneur
    container.appendChild(videoElement);
    container.appendChild(countdownContainer);
    container.appendChild(canvasElement);
    
    log('Éléments DOM créés et configurés');
    
    return {
      videoElement,
      canvasElement,
      countdownContainer,
      countdownElement
    };
  };
  
  // État pour indiquer que le composant est monté côté client
  useEffect(() => {
    log('Composant monté côté client');
    setStatus('mounted');
    
    // Nettoyer lors du démontage
    return () => {
      log('Nettoyage avant démontage');
      const videoEl = document.getElementById('camera-video');
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Effet pour démarrer le processus une fois le composant monté
  useEffect(() => {
    if (status === 'mounted') {
      log('Démarrage du processus dans 1 seconde...');
      const timer = setTimeout(() => {
        activateCamera();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  // Activer la caméra de manière impérative
  const activateCamera = async () => {
    try {
      log('Activation de la caméra...');
      
      // Créer les éléments nécessaires
      const elements = setupCameraElements();
      if (!elements) {
        log('Les éléments ne sont pas prêts, report...');
        setTimeout(activateCamera, 500);
        return;
      }
      
      const { videoElement, countdownContainer, countdownElement } = elements;
      
      // Demander l'accès à la caméra
      log('Demande d\'accès à la caméra...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      log('Accès à la caméra accordé');
      
      // Assigner le flux à l'élément vidéo
      videoElement.srcObject = stream;
      
      // Fonction pour démarrer le compte à rebours
      const startCountdown = () => {
        log('Démarrage du compte à rebours');
        setStatus('camera-active');
        
        countdownContainer.style.display = 'flex';
        let count = 1;
        setCountdown(count);
        countdownElement.textContent = count.toString();
        
        const countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);
          countdownElement.textContent = count.toString();
          
          if (count <= 0) {
            clearInterval(countdownInterval);
            captureImage();
          }
        }, 1000);
        
        // Nettoyer l'intervalle si nécessaire
        return () => clearInterval(countdownInterval);
      };
      
      // Attendre que la vidéo soit chargée
      videoElement.onloadeddata = () => {
        log(`Vidéo chargée (${videoElement.videoWidth}x${videoElement.videoHeight})`);
        
        // Attendre un peu pour s'assurer que la vidéo est stable
        setTimeout(startCountdown, 500);
      };
      
    } catch (err) {
      log(`Erreur d'activation: ${err.message}`);
      setError(`Erreur d'activation de la caméra: ${err.message}`);
      setStatus('error');
    }
  };
  
  // Capturer l'image après le compte à rebours
  const captureImage = () => {
    try {
      log('Capture de l\'image...');
      
      // Obtenir les éléments DOM
      const videoElement = document.getElementById('camera-video');
      const canvasElement = document.getElementById('capture-canvas');
      
      if (!videoElement || !canvasElement) {
        throw new Error('Éléments vidéo ou canvas non disponibles');
      }
      
      // Vérifier que la vidéo est prête
      if (!videoElement.videoWidth || !videoElement.videoHeight) {
        throw new Error('Les dimensions de la vidéo ne sont pas disponibles');
      }
      
      // Configurer le canvas
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      
      // Capturer l'image
      const ctx = canvasElement.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      
      // Obtenir l'image en base64
      const imageData = canvasElement.toDataURL('image/jpeg', 0.95);
      setImageData(imageData);
      log(`Image capturée (${Math.round(imageData.length / 1024)} KB)`);
      
      // Arrêter la vidéo
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Mettre à jour l'état
      setStatus('processing');
      
      // Envoyer l'image au backend
      sendToBackend(imageData);
      
    } catch (err) {
      log(`Erreur de capture: ${err.message}`);
      setError(`Erreur lors de la capture: ${err.message}`);
      setStatus('error');
    }
  };
  
  // Envoyer l'image au backend
  const sendToBackend = async (imageData) => {
    try {
      log('Envoi de l\'image au backend...');
      
      const response = await fetch('http://localhost:8000/predict-base64/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      log(`Réponse reçue: ${JSON.stringify(data)}`);
      
      if (data.prediction === "Aucun visage détecté") {
        throw new Error("Aucun visage n'a été détecté");
      }
      
      // Notifier le composant parent
      if (onEmotionDetected) {
        onEmotionDetected({
          emotion: data.prediction,
          confidence: data.confidence,
          allPredictions: data.all_predictions || {},
          imageData: data.face_image || imageData
        });
      }
      
    } catch (err) {
      log(`Erreur d'analyse: ${err.message}`);
      setError(`Erreur: ${err.message}`);
      setStatus('error');
    }
  };
  
  // Utiliser la simulation au lieu du backend
  const useSimulation = () => {
    log('Utilisation de la simulation...');
    setStatus('processing');
    
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'neutral', 'surprise', 'fear', 'disgust', 'angry'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.7 + Math.random() * 0.3;
      
      // Générer des prédictions simulées
      const allPredictions = {};
      emotions.forEach(e => {
        allPredictions[e] = e === randomEmotion ? confidence : Math.random() * (1 - confidence) / 6;
      });
      
      log(`Émotion simulée: ${randomEmotion} (${(confidence * 100).toFixed(1)}%)`);
      
      // Créer une image de test si nécessaire
      const simulatedImage = imageData || createPlaceholderImage();
      
      // Notifier le composant parent
      if (onEmotionDetected) {
        onEmotionDetected({
          emotion: randomEmotion,
          confidence: confidence,
          allPredictions: allPredictions,
          imageData: simulatedImage
        });
      }
    }, 1000);
  };
  
  // Créer une image placeholder pour la simulation
  const createPlaceholderImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    // Fond
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Visage
    ctx.beginPath();
    ctx.arc(160, 120, 80, 0, Math.PI * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.fill();
    
    // Yeux
    ctx.beginPath();
    ctx.arc(120, 100, 10, 0, Math.PI * 2);
    ctx.arc(200, 100, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#404040';
    ctx.fill();
    
    // Bouche
    ctx.beginPath();
    ctx.arc(160, 140, 40, 0, Math.PI);
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    return canvas.toDataURL('image/jpeg');
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">Analyse de votre réaction</h3>
      
      {/* Conteneur pour les éléments de caméra (créés dynamiquement) */}
      <div id="camera-container" className="w-full relative mb-4">
        {status === 'initializing' && (
          <div className="text-center p-4">
            <p>Initialisation...</p>
            <div className="mt-2 w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
      
      {/* Affichage de l'image capturée */}
      {imageData && status === 'processing' && (
        <div className="mt-4 text-center w-full">
          <h4 className="font-medium mb-2">Image capturée:</h4>
          <img 
            src={imageData} 
            alt="Capture" 
            className="max-w-full mx-auto rounded-lg border-2 border-blue-500"
            style={{ maxHeight: '300px' }}
          />
          <p className="mt-4">Analyse de l'émotion en cours...</p>
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mt-2"></div>
        </div>
      )}
      
      {/* Affichage des erreurs */}
      {status === 'error' && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <p className="font-medium">{error}</p>
          
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => {
                setStatus('initializing');
                setError(null);
                setTimeout(() => setStatus('mounted'), 100);
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
            
            <button
              onClick={useSimulation}
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Utiliser simulation
            </button>
          </div>
        </div>
      )}
      
      {/* Journal de débogage */}
      <details className="w-full mt-4">
        <summary className="cursor-pointer font-medium text-gray-700">Journal de débogage</summary>
        <div className="p-2 bg-gray-50 rounded text-xs text-gray-700 mt-2 max-h-40 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default EmotionCapture;