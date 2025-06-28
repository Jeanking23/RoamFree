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
    'transport.duration': 'Durée',
    'transport.busType': 'Type de Bus',
    'transport.viewRouteMap': 'Voir Carte du Trajet (Démo)',
    'transport.viewSeatsBook': 'Voir Sièges & Réserver',
    'transport.pricePerPassenger': 'Prix par passager',
    'transport.noIntercityBusRoutesFound': 'Aucun itinéraire de bus interurbain trouvé.',
    'transport.tryDifferentCitiesDates': 'Essayez différentes villes ou dates.',
    'transport.filters': 'Filtres',
    'transport.busFeatures': 'Équipements du Bus',
    'transport.usbCharging': 'Chargement USB',
    'transport.reclinerSeats': 'Sièges Inclinables',
    'transport.onboardRestroom': 'Toilettes à Bord',
    'transport.tripType': 'Type de Voyage',
    'transport.operatorRating': 'Note de l\'Opérateur',
    'transport.fareType': 'Type de Tarif',
    'transport.safetyAccessibility': 'Sécurité & Accessibilité',
    'transport.femaleOnlySeating': 'Zone pour Femmes',
    'transport.wheelchairAccessibleBus': 'Accessible Fauteuil Roulant',
    'transport.childFriendlySeating': 'Adapté aux Enfants',
    'transport.selectSeatsFor': 'Sélectionnez Vos Sièges pour',
    'transport.pleaseSelectSeats': 'Veuillez sélectionner',
    'transport.seatOrSeats': 'siège(s)',
    'transport.seatAvailabilityNote': 'La disponibilité des sièges est illustrative (Démo). Survolez pour le type de siège.',
    'transport.seatAvailable': 'Disponible',
    'transport.seatReserved': 'Réservé (Démo)',
    'transport.seatSelected': 'Sélectionné',
    'transport.seatTaken': 'Occupé',
    'transport.front': 'Avant',
    'transport.seatPreferenceFilters': 'Filtres de Préférence de Siège',
    'transport.window': 'Fenêtre',
    'transport.aisle': 'Couloir',
    'transport.frontRow': 'Première Rangée',
    'transport.exitRow': 'Rangée de Sortie',
    'transport.recliner': 'Inclinable',
    'transport.extraLegroom': 'Plus d\'Espace',
    'transport.selected': 'Sélectionné',
    'transport.cancel': 'Annuler',
    'transport.confirmSeatsProceed': 'Confirmer & Continuer',
    'transport.passengerDetailsFor': 'Détails des Passagers pour',
    'transport.passengerDetailsDesc': 'Entrez les détails pour chaque passager. Sièges :',
    'transport.loadFromSavedProfiles': 'Charger depuis les profils enregistrés (Démo)',
    'transport.passenger': 'Passager',
    'transport.fullName': 'Nom Complet',
    'transport.idType': 'Type de Pièce d\'Identité',
    'transport.passport': 'Passeport',
    'transport.nationalId': 'Carte d\'Identité Nationale',
    'transport.driverLicense': 'Permis de Conduire',
    'transport.idNumber': 'Numéro d\'Identité',
    'transport.saveSeatingPrefNote': 'Les préférences de siège peuvent être enregistrées (Démo).',
    'transport.uploadIdPassportDemo': 'Télécharger ID/Passeport (Démo)',
    'transport.confirmDetailsProceed': 'Confirmer & Continuer',
    'transport.fareBreakdownAddons': 'Détail du Tarif & Suppléments',
    'transport.reviewFareAddExtras': 'Vérifiez votre tarif et ajoutez des extras.',
    'transport.baseFare': 'Tarif de Base :',
    'transport.taxesSurcharges': 'Taxes & Frais (Démo) :',
    'transport.addOns': 'Suppléments (Démo) :',
    'transport.addOnSnacks': 'Snacks/Eau/Oreillers',
    'transport.addOnInsurance': 'Assurance Voyage',
    'transport.addOnPriorityBoarding': 'Embarquement Prioritaire',
    'transport.addOnExtraBaggage': 'Bagage Supplémentaire (1)',
    'transport.addOnWifi': 'Bon Wi-Fi',
    'transport.addOnCarbonOffset': 'Don Compensation Carbone',
    'transport.included': 'Inclus',
    'transport.totalPrice': 'Prix Total :',
    'transport.confirmAndPay': 'Confirmer et Payer',

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
    'transport.bookBusTicketLink': 'Réserver un Billet de Bus (Ancienne Page)',
    'transport.flightSearchLink': 'Recherche & Réservation de Vols',
    'transport.platformFeaturesTitle': 'Fonctionnalités de la Plateforme',
    'transport.featureDriverVerification': 'Vérification Chauffeur/Opérateur & Notes (Démo)',
    'transport.featureGpsTracking': 'Suivi GPS en Temps Réel (Démo)',
    'transport.featureInAppCommunication': 'Communication Chauffeur/Opérateur via l\'App (Démo)',
    'transport.featureSecurePayments': 'Paiements Sécurisés via l\'App (Démo)',
    'transport.featureBaggageAssistance': 'Option Assistance Bagages (Démo pour trajets)',
    'transport.eTicketBoardingPass': 'E-Ticket / Carte d\'Embarquement',
    'transport.eTicketDesc': 'Votre billet pour',
    'transport.eTicketOfflineNote': 'Cet E-Ticket est accessible hors ligne (Démo). Faites une capture d\'écran.',
    'transport.passengerName': 'Passager(s) :',
    'transport.seatNumber': 'Siège(s) :',
    'transport.tripId': 'ID du Voyage :',
    'transport.route': 'Trajet :',
    'transport.departure': 'Départ :',
    'transport.boardingIn': 'Embarquement dans :',
    'transport.liveTrackBus': 'Suivre le Bus en Direct',
    'transport.close': 'Fermer',
    'transport.stationInformation': 'Informations sur la Gare',
    'transport.gateNumberDemo': 'Numéro de Porte (Démo) :',
    'transport.parkingInfoDemo': 'Infos Parking (Démo) :',
    'transport.amenities': 'Équipements :',
    'transport.getDirectionsToStation': 'Obtenir l\'Itinéraire vers la Gare (Démo)',
    'transport.liveNavigationDemo': 'Navigation en Direct (Démo)',
    'transport.startingNavigationTo': 'Démarrage de la navigation vers',
    'transport.viaGoogleMaps': 'via Google Maps/OpenStreetMap.',
    'transport.operatorProfile': 'Profil de l\'Opérateur',
    'transport.verifiedProviderDemo': 'Fournisseur Vérifié (Démo)',
    'transport.ratingsDemo': 'Évaluations (Démo) :',
    'transport.overall': 'Général :',
    'transport.punctuality': 'Ponctualité :',
    'transport.cleanliness': 'Propreté :',
    'transport.busImagesTypes': 'Images & Types de Bus (Démo) :',
    'transport.policies': 'Politiques :',
    'transport.refundPolicy': 'Remboursement :',
    'transport.luggagePolicy': 'Bagages :',
    'transport.liveBusTracking': 'Suivi de Bus en Direct',
    'transport.trackingTrip': 'Suivi du voyage',
    'transport.currentStatus': 'Statut Actuel :',
    'transport.initializingTracking': 'Initialisation du suivi...',
    'transport.alertsDemo': 'Alertes (Démo) :',
    'transport.alertBus10Min': 'Le bus est à 10 minutes (Notification Envoyée)',
    'transport.alertNowBoarding': 'Embarquement en cours (Notification Envoyée)',
    'transport.alertTripDelayed': 'Voyage retardé - Nouvelle ETA : 15:55 (Exemple d\'Alerte)',
    'transport.contactOperatorDemo': 'Contacter l\'Opérateur (Démo)',
    'transport.openingChatWith': 'Ouverture du chat avec l\'opérateur...',
    'transport.chatWithOperator': 'Chatter avec l\'Opérateur',
    'transport.emergencySosNote': 'Le bouton SOS d\'urgence est disponible dans l\'en-tête de l\'application.',
    'header.ownerDashboard': 'Tableau de Bord Propriétaire'
  }
};


interface LocalizationContextType {
  selectedLanguage: Language;
  selectedRegion: Region;
  selectedCurrency: Currency;
  setLanguage: (language: Language, silent?: boolean) => void;
  setRegion: (region: Region, silent?: boolean) => void;
  setCurrency: (currency: Currency, silent?: boolean) => void;
  getTranslatedText: (key: string, fallback: string) => string;
  isHydrated: boolean; 
}

const defaultLanguage = languages.find(l => l.code === 'en') || languages[0];
const defaultRegion = regions.find(r => r.code === 'US') || regions[0];
const defaultCurrency = currencies.find(c => c.code === 'USD') || currencies[0];

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>(defaultLanguage);
  const [selectedRegion, setSelectedRegionState] = useState<Region>(defaultRegion);
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(defaultCurrency);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedLangCode = localStorage.getItem('roamfree-lang');
    const storedRegionCode = localStorage.getItem('roamfree-region');
    const storedCurrencyCode = localStorage.getItem('roamfree-currency');

    let initialRegion = defaultRegion;
    if (storedRegionCode) {
      initialRegion = regions.find(r => r.code === storedRegionCode) || defaultRegion;
    }
    setSelectedRegionState(initialRegion);

    let initialLang = defaultLanguage;
    if (storedLangCode) {
      initialLang = languages.find(l => l.code === storedLangCode) || languages.find(l => l.code === initialRegion.defaultLang) || defaultLanguage;
    } else {
      initialLang = languages.find(l => l.code === initialRegion.defaultLang) || defaultLanguage;
    }
    setSelectedLanguageState(initialLang);
    
    let initialCurrency = defaultCurrency;
    if (storedCurrencyCode) {
      initialCurrency = currencies.find(c => c.code === storedCurrencyCode) || currencies.find(c => c.code === initialRegion.defaultCurrency) || defaultCurrency;
    } else {
      initialCurrency = currencies.find(c => c.code === initialRegion.defaultCurrency) || defaultCurrency;
    }
    setSelectedCurrencyState(initialCurrency);

    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((language: Language, silent = false) => {
    setSelectedLanguageState(language);
    if (isHydrated) localStorage.setItem('roamfree-lang', language.code);
  }, [isHydrated]);

  const setCurrency = useCallback((currency: Currency, silent = false) => {
    setSelectedCurrencyState(currency);
    if (isHydrated) localStorage.setItem('roamfree-currency', currency.code);
  }, [isHydrated]);

  const setRegion = useCallback((region: Region, silent = false) => {
    setSelectedRegionState(region);
    const newLang = languages.find(l => l.code === region.defaultLang) || selectedLanguage;
    const newCurrency = currencies.find(c => c.code === region.defaultCurrency) || selectedCurrency;
    
    setSelectedLanguageState(newLang); 
    setSelectedCurrencyState(newCurrency);

    if (isHydrated) {
      localStorage.setItem('roamfree-region', region.code);
      localStorage.setItem('roamfree-lang', newLang.code); 
      localStorage.setItem('roamfree-currency', newCurrency.code);
    }
  }, [isHydrated, selectedLanguage, selectedCurrency]);


  const getTranslatedText = useCallback((key: string, fallback: string): string => {
    if (translationsData[selectedLanguage.code] && translationsData[selectedLanguage.code][key]) {
      return translationsData[selectedLanguage.code][key];
    }
    return fallback;
  }, [selectedLanguage.code]);
  
  const contextValue: LocalizationContextType = {
    selectedLanguage,
    selectedRegion,
    selectedCurrency,
    setLanguage,
    setRegion,
    setCurrency,
    getTranslatedText,
    isHydrated,
  };
  
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