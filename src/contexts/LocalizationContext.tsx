
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Region {
  code: string;
  name: string;
  flag: string;
  defaultLang: string;
  defaultCurrency: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Predefined lists
export const languages: Language[] = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸' },
  { code: 'gb', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export const regions: Region[] = [
    { code: 'CM', name: 'Cameroon', flag: '🇨🇲', defaultLang: 'fr', defaultCurrency: 'XAF' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', defaultLang: 'en', defaultCurrency: 'NGN' },
    { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', defaultLang: 'fr', defaultCurrency: 'XAF' },
    { code: 'US', name: 'United States', flag: '🇺🇸', defaultLang: 'en', defaultCurrency: 'USD' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', defaultLang: 'gb', defaultCurrency: 'GBP' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', defaultLang: 'de', defaultCurrency: 'EUR' },
    { code: 'FR', name: 'France', flag: '🇫🇷', defaultLang: 'fr', defaultCurrency: 'EUR' },
    { code: 'CN', name: 'China', flag: '🇨🇳', defaultLang: 'zh', defaultCurrency: 'CNY' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', defaultLang: 'ja', defaultCurrency: 'JPY' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', defaultLang: 'ar', defaultCurrency: 'AED'},
];

export const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'XAF', name: 'CFA Franc BEAC', symbol: 'FCFA' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

// Simple hardcoded translations for demonstration
const translationsData: Record<string, Record<string, string>> = {
  fr: {
    'transport.requestRideTitle': 'Demander ou Planifier un Trajet',
    'transport.requestRideDescription': 'Remplissage auto. depuis hébergement/calendrier (Démo). Rappels pour trajets planifiés (Démo).',
    'transport.pickupLocation': 'Lieu de Prise en Charge',
    'transport.dropoffLocation': 'Lieu de Dépose',
    'transport.pickupDate': 'Date de Prise en Charge',
    'transport.pickupTime': 'Heure de Prise en Charge',
    'transport.pickDate': 'Choisir une date',
    'transport.scheduleAdvance': 'Planifier ce trajet à l\'avance',
    'transport.filtersPreferences': 'Filtres & Préférences',
    'transport.rideTypes': 'Types de Trajet',
    'transport.economy': 'Économie',
    'transport.comfort': 'Confort',
    'transport.suvXl': 'SUV/XL',
    'transport.premium': 'Premium',
    'transport.accessibilityNeeds': 'Besoins d\'Accessibilité',
    'transport.wheelchair': 'Fauteuil Roulant',
    'transport.babySeat': 'Siège Bébé',
    'transport.petFriendly': 'Animaux Autorisés',
    'transport.ridePreferences': 'Préférences de Trajet',
    'transport.quietRide': 'Trajet Silencieux',
    'transport.wifi': 'Wi-Fi',
    'transport.ac': 'Climatisation',
    'transport.seePrices': 'Voir les Prix',
    'transport.fetchingRides': 'Recherche de trajets...',
    'transport.findingBestRides': 'Recherche des meilleurs trajets pour vous...',
    'transport.availableRideOptions': 'Options de Trajet Disponibles',
    'transport.fareBreakdownTitle': 'Détail du Tarif (Démo)',
    'transport.fareDetails': 'Détails du tarif',
    'transport.choose': 'Choisir',
    'transport.noRidesMatch': 'Aucun trajet ne correspond à vos filtres actuels.',
    'transport.tryAdjustingFilters': 'Essayez d\'ajuster vos préférences ou votre lieu.',
    'transport.useCurrentLocation': 'Utiliser ma position actuelle',
    'transport.addStops': 'Ajouter plusieurs arrêts',
    'transport.comingSoon': 'Bientôt disponible',
    'transport.scheduleReturn': 'Planifier un trajet retour',
    'transport.rentalCarsTitle': 'Recherche de Voitures de Location',
    'transport.rentalCarsDescription': 'Comparez les offres de voitures de location.',
    'transport.pickupCityAirport': 'Ville ou aéroport de prise en charge',
    'transport.dropoffLocationOptional': 'Lieu de dépose (Optionnel)',
    'transport.dropoffSameAsPickup': 'Laisser vide si identique à la prise en charge',
    'transport.dropoffDate': 'Date de Dépose',
    'transport.dropoffTime': 'Heure de Dépose',
    'transport.searchCars': 'Rechercher des Voitures',
    'transport.carRentalSearchTitle': 'Recherche de Location de Voiture (Démo)',
    'transport.searchingCars': 'Recherche de voitures de location disponibles...',
    'transport.flightsTitle': 'Recherche de Vols',
    'transport.flightsDescription': 'Trouvez les meilleurs tarifs pour vos vols.',
    'transport.origin': 'Origine',
    'transport.destination': 'Destination',
    'transport.originPlaceholder': 'Saisir aéroport/ville d\'origine (ex: CDG)',
    'transport.destinationPlaceholder': 'Saisir aéroport/ville de destination (ex: LHR)',
    'transport.departureDate': 'Date de Départ',
    'transport.returnDateOptional': 'Date de Retour (Optionnel)',
    'transport.searchFlights': 'Rechercher des Vols',
    'transport.flightSearchTitle': 'Recherche de Vols (Démo)',
    'transport.searchingFlights': 'Recherche de vols disponibles...',
    'transport.intercityBusTitle': 'Billets de Bus Interurbains',
    'transport.intercityBusDescription': 'Réservez vos billets de bus pour voyager entre les villes.',
    'transport.searchIntercityBusTitle': 'Rechercher des Billets de Bus Interurbains',
    'transport.searchIntercityBusDescription': 'Trouvez des itinéraires de bus entre les villes, avec divers opérateurs et options.',
    'transport.originCity': 'Ville d\'Origine',
    'transport.destinationCity': 'Ville de Destination',
    'transport.originCityPlaceholder': 'ex: Douala',
    'transport.destinationCityPlaceholder': 'ex: Yaoundé',
    'transport.passengers': 'Passagers',
    'transport.roundTrip': 'aller-retour',
    'transport.oneWay': 'aller simple',
    'transport.intercityBusRoutesFound': 'Itinéraires de Bus Interurbains Trouvés !',
    'transport.searchIntercityBuses': 'Rechercher des Bus Interurbains',
    'transport.searchingBuses': 'Recherche de bus...',
    'transport.findingIntercityBusRoutes': 'Recherche d\'itinéraires de bus interurbains...',
    'transport.availableIntercityRoutes': 'Itinéraires Interurbains Disponibles',
    'transport.departs': 'Départ',
    'transport.arrives': 'Arrivée',
    'transport.seatsAvailable': 'sièges disponibles',
    'transport.viewDetailsTitle': 'Voir Détails (Démo)',
    'transport.selectedOperator': 'Sélectionné',
    'transport.seatSelectionNext': 'Sélection des sièges et réservation ensuite.',
    'transport.viewDetailsBook': 'Voir Détails & Réserver',
    'transport.noIntercityBusRoutesFound': 'Aucun itinéraire de bus interurbain trouvé.',
    'transport.tryDifferentCitiesDates': 'Essayez différentes villes ou dates.',
    'transport.filters': 'Filtres',
    'transport.busFeatures': 'Équipements du Bus : AC, Wi-Fi, USB, Inclinable, Toilettes',
    'transport.tripType': 'Type de Voyage : Jour / Nuit',
    'transport.operatorRating': 'Note de l\'Opérateur',
    'transport.fareType': 'Type de Tarif : Payer Maintenant / Réserver Maintenant, Payer Plus Tard',
    'transport.intercityBusFeaturesTitle': 'Fonctionnalités des Bus Interurbains',
    'transport.comingSoonDemo': 'Bientôt / Démo',
    'transport.featureFareBreakdown': 'Détail du Tarif (base, taxes, suppléments)',
    'transport.featureReservePayLater': 'Réserver Maintenant, Payer Plus Tard (retenue 1h)',
    'transport.featureGroupBooking': 'Réservation de Groupe (passagers multiples, profils enregistrés, téléch. ID)',
    'transport.feature3DSeatSelection': 'Sélection de Siège 3D Interactive (dispo. temps réel, filtres)',
    'transport.featureETicketQR': 'E-Ticket & QR Code d\'Embarquement (accès hors ligne, compte à rebours)',
    'transport.featureStationInfoNav': 'Infos Gare & Navigation en Direct vers le terminal',
    'transport.featureOperatorProfiles': 'Profils des Opérateurs (notes, avis, photos, politiques)',
    'transport.featureLiveBusTracking': 'Suivi de Bus en Direct (GPS, ETA, notifications de retard)',
    'transport.featurePassengerInfoManagement': 'Gestion Infos Passagers (profils enregistrés, téléch. docs)',
    'transport.featureAddons': 'Suppléments : Snacks, Assurance, Wi-Fi, Bagages, Compensation CO2',
    'transport.featureBusChatAnnouncements': 'Chat du Bus & Annonces Opérateur',
    'transport.featureSafetyFilters': 'Filtres Sécurité : sièges réservés femmes, accessible fauteuil roulant, adapté enfants',
    'transport.pageTitle': 'Planifiez Votre Voyage',
    'transport.pageDescription': 'Demandez un trajet, réservez des billets de bus interurbains, trouvez des voitures de location ou explorez diverses options de transport.',
    'transport.tabRideBooking': 'Réservation Trajet',
    'transport.tabIntercityBus': 'Bus Interurbain',
    'transport.tabRentalCars': 'Location Voitures',
    'transport.tabFlights': 'Vols',
    'transport.realTimeMapTitle': 'Carte Interactive en Temps Réel',
    'transport.realTimeMapDescription': 'Visualisez les emplacements des véhicules en direct, les heures d\'arrivée estimées et les aperçus d\'itinéraire. (La fonctionnalité complète de carte en temps réel nécessite des services backend et des API de cartographie comme Google Maps ou Mapbox.)',
    'transport.shareMyTrip': 'Partager Mon Trajet',
    'transport.navigationAssistant': 'Assistant de Navigation',
    'transport.demo': 'Démo',
    'transport.interactiveMapSimulation': 'Simulation de carte interactive.',
    'transport.carpoolTitle': 'Covoiturage & Partage de Trajet',
    'transport.carpoolDescription': 'Fonctionnalité à venir ! Trouvez des voyageurs avec des itinéraires similaires pour partager les trajets et diviser les tarifs.',
    'transport.exploreCarpool': 'Explorer les Options de Covoiturage',
    'transport.destinationSuggestionsTitle': 'Suggestions de Destinations',
    'transport.destinationSet': 'Destination Définie',
    'transport.destinationSetAsDropoff': 'défini comme lieu de dépose pour la réservation de trajet.',
    'transport.otherTransportOptionsTitle': 'Autres Options de Transport',
    'transport.rentACarLink': 'Louer une Voiture',
    'transport.busTicketsLegacyLink': 'Billets de Bus (Ancien)',
    'transport.flightSearchLink': 'Recherche & Réservation de Vols',
    'transport.platformFeaturesTitle': 'Fonctionnalités de la Plateforme',
    'transport.featureDriverVerification': 'Vérification Chauffeur/Opérateur & Notes (Démo)',
    'transport.featureGpsTracking': 'Suivi GPS en Temps Réel (Démo)',
    'transport.featureInAppCommunication': 'Communication Chauffeur/Opérateur via l\'App (Démo)',
    'transport.featureSecurePayments': 'Paiements Sécurisés via l\'App (Démo)',
    'transport.featureBaggageAssistance': 'Option Assistance Bagages (Démo pour trajets)',
    'header.ownerDashboard': 'Tableau de Bord Propriétaire',
  },
  // Add other languages and their translations here
};


interface LocalizationContextType {
  selectedLanguage: Language;
  selectedRegion: Region;
  selectedCurrency: Currency;
  setLanguage: (language: Language, silent?: boolean) => void;
  setRegion: (region: Region, silent?: boolean) => void;
  setCurrency: (currency: Currency, silent?: boolean) => void;
  getTranslatedText: (key: string, fallback: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>(languages.find(l => l.code === 'en') || languages[0]);
  const [selectedRegion, setSelectedRegionState] = useState<Region>(regions.find(r => r.code === 'US') || regions[0]);
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(currencies.find(c => c.code === 'USD') || currencies[0]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const storedLangCode = typeof window !== "undefined" ? localStorage.getItem('roamfree-lang') : null;
    const storedRegionCode = typeof window !== "undefined" ? localStorage.getItem('roamfree-region') : null;
    const storedCurrencyCode = typeof window !== "undefined" ? localStorage.getItem('roamfree-currency') : null;

    const initialRegion = regions.find(r => r.code === storedRegionCode) || regions.find(r => r.code === 'US') || regions[0];
    setSelectedRegionState(initialRegion);

    const initialLang = languages.find(l => l.code === storedLangCode) || languages.find(l => l.code === initialRegion.defaultLang) || languages[0];
    setSelectedLanguageState(initialLang);
    
    const initialCurrency = currencies.find(c => c.code === storedCurrencyCode) || currencies.find(c => c.code === initialRegion.defaultCurrency) || currencies[0];
    setSelectedCurrencyState(initialCurrency);
  }, []);

  const setLanguage = useCallback((language: Language, silent = false) => {
    setSelectedLanguageState(language);
    if (hasMounted && typeof window !== "undefined") localStorage.setItem('roamfree-lang', language.code);
  }, [hasMounted]);

  const setCurrency = useCallback((currency: Currency, silent = false) => {
    setSelectedCurrencyState(currency);
    if (hasMounted && typeof window !== "undefined") localStorage.setItem('roamfree-currency', currency.code);
  }, [hasMounted]);

  const setRegion = useCallback((region: Region, silent = false) => {
    setSelectedRegionState(region);
    if (hasMounted && typeof window !== "undefined") localStorage.setItem('roamfree-region', region.code);

    const newLang = languages.find(l => l.code === region.defaultLang) || selectedLanguage;
    setLanguage(newLang, true); // silent update
    
    const newCurrency = currencies.find(c => c.code === region.defaultCurrency) || selectedCurrency;
    setCurrency(newCurrency, true); // silent update
  }, [hasMounted, selectedLanguage, selectedCurrency, setLanguage, setCurrency]);

  const getTranslatedText = useCallback((key: string, fallback: string): string => {
    if (translationsData[selectedLanguage.code] && translationsData[selectedLanguage.code][key]) {
      return translationsData[selectedLanguage.code][key];
    }
    return fallback;
  }, [selectedLanguage.code]);


  const contextValue = {
    selectedLanguage,
    selectedRegion,
    selectedCurrency,
    setLanguage,
    setRegion,
    setCurrency,
    getTranslatedText,
  };
  
  // Important: Prevent rendering children until hasMounted is true to avoid hydration mismatches with localStorage
  if (!hasMounted) {
    return null; 
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

    