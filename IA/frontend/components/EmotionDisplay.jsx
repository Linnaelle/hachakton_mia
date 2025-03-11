// components/EmotionDisplay.jsx
'use client';

import React from 'react';

// Map des émotions en français pour l'affichage
const emotionLabels = {
  'angry': 'Colère',
  'disgust': 'Dégoût',
  'fear': 'Peur',
  'happy': 'Joie',
  'neutral': 'Neutre',
  'sad': 'Tristesse',
  'surprise': 'Surprise'
};

// Map des couleurs pour chaque émotion
const emotionColors = {
  'angry': 'bg-red-500',
  'disgust': 'bg-purple-500',
  'fear': 'bg-yellow-500',
  'happy': 'bg-green-500',
  'neutral': 'bg-gray-500',
  'sad': 'bg-blue-500',
  'surprise': 'bg-pink-500'
};

// Map des icônes emoji pour chaque émotion
const emotionEmojis = {
  'angry': '😠',
  'disgust': '🤢',
  'fear': '😨',
  'happy': '😃',
  'neutral': '😐',
  'sad': '😢',
  'surprise': '😲'
};

const EmotionDisplay = ({ prediction }) => {
  if (!prediction || !prediction.all_predictions) {
    return null;
  }

  const { prediction: predictedEmotion, confidence, all_predictions } = prediction;
  
  // Formatter les prédictions pour l'affichage
  const formattedPredictions = Object.entries(all_predictions)
    .map(([emotion, score]) => ({
      emotion,
      score,
      label: emotionLabels[emotion] || emotion,
      color: emotionColors[emotion] || 'bg-gray-500',
      emoji: emotionEmojis[emotion] || '❓'
    }))
    .sort((a, b) => b.score - a.score);
  
  const topPrediction = formattedPredictions[0];
  const confidencePercent = (topPrediction.score * 100).toFixed(1);

  return (
    <div className="flex flex-col">
      <div className="mb-6 text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-6xl mb-2">{topPrediction.emoji}</div>
        <h3 className="text-2xl font-bold mb-1 text-gray-800">{topPrediction.label}</h3>
        <p className="text-lg font-medium text-gray-600">
          {confidencePercent}% de confiance
        </p>
      </div>
      
      <h3 className="text-lg font-medium mb-3 text-gray-700">Toutes les prédictions:</h3>
      
      <div className="space-y-2">
        {formattedPredictions.map((item) => (
          <div key={item.emotion} className="flex items-center">
            <div className="mr-2 w-8 text-center">{item.emoji}</div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-gray-600">
                  {(item.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${item.color}`} 
                  style={{ width: `${item.score * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionDisplay;