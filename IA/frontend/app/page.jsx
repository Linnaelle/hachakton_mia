// app/page.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import EmotionDisplay from '../components/EmotionDisplay';
import CameraComponent from '../components/CameraComponent';

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [faceImage, setFaceImage] = useState(null);

  // Fonction pour gérer la capture et l'envoi de l'image au backend
  const handleCapture = async (imageSrc) => {
    try {
      setLoading(true);
      setError(null);
      
      // Envoyer l'image au backend
      const response = await fetch('http://localhost:8000/predict-base64/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.prediction === "Aucun visage détecté") {
        setError("Aucun visage détecté. Veuillez vous positionner face à la caméra.");
        setPrediction(null);
      } else {
        setPrediction(result);
        setFaceImage(result.face_image);
      }
    } catch (err) {
      console.error('Erreur lors de la prédiction:', err);
      setError(`Erreur lors de l'analyse: ${err.message}`);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  // Activer/désactiver la capture continue
  const toggleCapturing = () => {
    setCapturing(!capturing);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-100">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          Reconnaissance d'Émotions Faciales
        </h1>
        
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* Section caméra */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Caméra</h2>
            <CameraComponent 
              onCapture={handleCapture} 
              capturing={capturing} 
              setCapturing={setCapturing}
            />
            
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={toggleCapturing}
                className={`px-4 py-2 rounded-md font-medium ${
                  capturing 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {capturing ? 'Arrêter la capture' : 'Démarrer la capture continue'}
              </button>
              
              {!capturing && (
                <button
                  onClick={() => document.getElementById('captureButton').click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
                  disabled={loading}
                >
                  {loading ? 'Analyse en cours...' : 'Capturer une image'}
                </button>
              )}
            </div>
          </div>
          
          {/* Section résultat */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Résultat</h2>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {!loading && !error && faceImage && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Visage détecté:</h3>
                <img 
                  src={faceImage} 
                  alt="Visage détecté" 
                  className="w-full max-w-[300px] mx-auto border-2 border-gray-300 rounded-md"
                />
              </div>
            )}
            
            {prediction && <EmotionDisplay prediction={prediction} />}
            
            {!prediction && !loading && !error && (
              <div className="text-center p-8 text-gray-500">
                Capturez une image pour obtenir une prédiction
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600">
          <p>Utilisez cette application pour détecter les émotions en temps réel.</p>
          <p className="mt-2 text-sm">
            Modèle entraîné sur le dataset FER2013 avec 7 catégories d'émotions.
          </p>
        </div>
      </div>
    </main>
  );
}