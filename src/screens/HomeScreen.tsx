/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HOME SCREEN (Full Dashboard)
 * ═══════════════════════════════════════════════════════════════
 *
 * The main dashboard. Built from web app components:
 *   1. Do Now Banner (stage, progress, warnings, disease watch, sprays, soil)
 *   2. Forecast Strip (4-day weather + spray suitability)
 *   3. Weekly Tasks (Spray | Nutrition | Cultural tabs)
 *   4. Alerts (Preventive + Community Outbreaks)
 *   5. Top Varieties
 *   6. Top Rootstocks
 *   7. Top Blogs
 *   8. Top Contributors
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenLayout from '../components/ScreenLayout';
import AuthPromptBanner from '../components/AuthPromptBanner';
import {
  DoNowBanner,
  ForecastStrip,
  WeeklyTasks,
  AlertsSection,
  TopVarieties,
  TopRootstocks,
  TopBlogs,
  TopContributors,
} from '../components/home';
import { useAuthStore } from '../store/authStore';

// ── Mock Data (mirrors web app's home/index.blade.php) ──

const STAGE = {
  name: 'Dormancy Break / Green Tip',
  nameHi: 'सुप्तावस्था / हरी कली',
  period: 'Mar 1 – Mar 20, 2026',
  progress: 65,
  nextStage: 'Tight Cluster',
  nextStageHi: 'कसी कली',
};

const SPRAYS = [
  { name: 'Copper Oxychloride 50WP', nameHi: 'कॉपर ऑक्सीक्लोराइड', dose: '300 gm / 200 L', target: 'Canker, Blossom Blight', group: 'Fungicide' as const, groupIcon: 'flask' },
  { name: 'Mancozeb 75WP', nameHi: 'मैन्कोजेब', dose: '400 gm / 200 L', target: 'Scab, Downy Mildew', group: 'Fungicide' as const, groupIcon: 'flask' },
  { name: 'Imidacloprid 17.8 SL', nameHi: 'इमिडाक्लोप्रिड', dose: '50 ml / 200 L', target: 'Woolly Aphid', group: 'Pesticide' as const, groupIcon: 'bug' },
  { name: 'Zinc Sulphate 21%', nameHi: 'जिंक सल्फेट', dose: '500 gm / 200 L', target: 'Zinc deficiency', group: 'Foliar' as const, groupIcon: 'leaf' },
];

const DISEASE_WATCH = [
  { name: 'Apple Scab', nameHi: 'सेब खुजली', type: 'fungal' as const, risk: 'high' as const, note: 'Wet weather forecast — spray before rain' },
  { name: 'Canker (Nectria)', nameHi: 'कैंकर रोग', type: 'fungal' as const, risk: 'medium' as const, note: 'Prune infected branches, apply copper paste' },
  { name: 'Woolly Aphid', nameHi: 'ऊनी माहू', type: 'pest' as const, risk: 'medium' as const, note: 'Monitor trunk & root collar weekly' },
  { name: 'San Jose Scale', nameHi: 'सैन जोज़ स्केल', type: 'pest' as const, risk: 'low' as const, note: 'Dormant oil spray if colonies found' },
];

const SOIL_NUTRITION = [
  { name: 'Urea (Nitrogen)', nameHi: 'यूरिया (नाइट्रोजन)', dose: '1 kg / tree', icon: 'seedling' },
  { name: 'FYM / Compost', nameHi: 'गोबर की खाद', dose: '20–30 kg / tree', icon: 'mound' },
];

const WEATHER_WARNINGS = [
  { type: 'frost', message: 'Low of 1°C expected — protect young grafts', severity: 'critical' as const },
];

const FORECAST = [
  { day: 'रवि', dayEn: 'Sun', date: 'Mar 9', icon: 'weather-sunny', iconColor: '#f59e0b', high: 18, low: 4, wind: 8, rain: 10, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
  { day: 'सोम', dayEn: 'Mon', date: 'Mar 10', icon: 'weather-partly-cloudy', iconColor: '#64748b', high: 17, low: 5, wind: 10, rain: 20, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
  { day: 'मंगल', dayEn: 'Tue', date: 'Mar 11', icon: 'weather-rainy', iconColor: '#3b82f6', high: 14, low: 3, wind: 14, rain: 70, suit: 'avoid' as const, suitLabel: 'Avoid', suitHi: 'टालें' },
  { day: 'बुध', dayEn: 'Wed', date: 'Mar 12', icon: 'weather-cloudy', iconColor: '#94a3b8', high: 15, low: 4, wind: 12, rain: 40, suit: 'caution' as const, suitLabel: 'Caution', suitHi: 'सावधानी' },
];

const TASKS = {
  spray: [
    { name: 'Copper Oxychloride 50WP', nameHi: 'कॉपर ऑक्सीक्लोराइड', slug: 'copper-oxychloride', dose: '300 gm / 200 L', when: 'Before bud break · 6–10 AM', whenHi: 'कली फूटने से पहले · सुबह', target: 'Canker, Blossom Blight', brands: [{ name: 'Blitox' }, { name: 'Blue Copper' }, { name: 'Fytolan' }], priority: 'essential' as const, phi: null, icon: 'fas fa-flask' },
    { name: 'Mancozeb 75WP', nameHi: 'मैन्कोजेब', slug: 'mancozeb', dose: '400 gm / 200 L', when: 'Green tip stage · Morning', whenHi: 'हरी कली अवस्था · सुबह', target: 'Scab, Downy Mildew', brands: [{ name: 'Dithane M-45' }, { name: 'Indofil M-45' }], priority: 'recommended' as const, phi: 5, icon: 'fas fa-flask' },
    { name: 'Imidacloprid 17.8 SL', nameHi: 'इमिडाक्लोप्रिड', slug: 'imidacloprid', dose: '50 ml / 200 L', when: 'Only if Woolly Aphid spotted', whenHi: 'ऊनी माहू दिखे तो', target: 'Woolly Aphid', brands: [{ name: 'Confidor' }, { name: 'Tatamida' }], priority: 'conditional' as const, phi: 14, icon: 'fas fa-bug' },
  ],
  nutrition: [
    { name: 'Zinc Sulphate 21%', nameHi: 'जिंक सल्फेट', dose: '500 gm / 200 L', when: 'Silver tip → green tip', whenHi: 'चाँदी से हरी कली तक', target: 'Zinc deficiency, shoot growth', brands: [{ name: 'Zincosol' }, { name: 'Bayer Zinc' }], priority: 'essential' as const, phi: null, icon: 'fas fa-leaf' },
    { name: 'Boron 20% (Solubor)', nameHi: 'बोरोन', slug: 'boron-fertilizer', dose: '100 gm / 200 L', when: 'Green tip · before bloom', whenHi: 'हरी कली — फूल से पहले', target: 'Fruit set, pollen viability', brands: [{ name: 'Solubor' }, { name: 'Boromax' }], priority: 'recommended' as const, phi: null, icon: 'fas fa-leaf' },
    { name: 'Urea 46% (Soil Drench)', nameHi: 'यूरिया — जड़ों में', dose: '1 kg / tree', when: 'Now · before bud break', whenHi: 'अभी — कली फूटने से पहले', target: 'Nitrogen — shoot vigour', brands: [{ name: 'IFFCO Urea' }, { name: 'NFL Urea' }], priority: 'essential' as const, phi: null, icon: 'fas fa-seedling' },
  ],
  cultural: [
    { name: 'Pruning — Dead Wood', nameHi: 'छँटाई — सूखी टहनियाँ', dose: null, when: 'Now (before bud break)', whenHi: 'अभी — कली फूटने से पहले', target: 'Canker removal, light entry', brands: null, priority: 'essential' as const, phi: null, icon: 'fas fa-scissors' },
    { name: 'Rootstock Sucker Removal', nameHi: 'मूलवृंत के अंकुर हटाएँ', dose: null, when: 'Weekly check', whenHi: 'साप्ताहिक जाँच', target: 'Prevent energy loss', brands: null, priority: 'recommended' as const, phi: null, icon: 'fas fa-cut' },
    { name: 'Grease Band Application', nameHi: 'ग्रीस बैंड लगाएँ', dose: null, when: 'Mar 10–20 (now)', whenHi: 'मार्च 10–20 (अभी)', target: 'Block Woolly Aphid migration', brands: null, priority: 'recommended' as const, phi: null, icon: 'fas fa-circle-dot' },
  ],
};

const PREVENTIVE_ALERTS = [
  { icon: 'fas fa-biohazard', title: 'Apple Scab Risk — High', titleHi: 'सेब खुजली का खतरा — अधिक', desc: 'Wet conditions forecast Mar 12–13. Apply Mancozeb or Captan before rain for best protection.', sev: 'critical' as const },
  { icon: 'fas fa-snowflake', title: 'Late Frost Possible — Mar 14–16', titleHi: 'देर से पाला पड़ सकता है', desc: 'Temperatures may drop to −2°C above 7500ft. Protect young grafts and new shoots.', sev: 'high' as const },
  { icon: 'fas fa-bug', title: 'Woolly Aphid Season Starting', titleHi: 'ऊनी माहू का मौसम शुरू', desc: 'Monitor trunk & branches weekly. Apply Imidacloprid or Chlorpyrifos at first sighting.', sev: 'medium' as const },
];

const OUTBREAK_ALERTS = [
  { location: 'Kullu — 7200ft', disease: 'Apple Scab Outbreak', diseaseHi: 'सेब खुजली का प्रकोप', reports: 34, when: '2 days ago', sev: 'critical' as const, tip: 'Spray Captan 50WP within 48 hours' },
  { location: 'Shimla — 6800ft', disease: 'Woolly Aphid', diseaseHi: 'ऊनी माहू', reports: 12, when: 'Yesterday', sev: 'high' as const, tip: 'Apply Chlorpyrifos or Imidacloprid' },
  { location: 'Kinnaur — 9200ft', disease: 'Canker (Nectria)', diseaseHi: 'कैंकर रोग', reports: 7, when: '3 days ago', sev: 'medium' as const, tip: 'Prune + copper paste on wounds' },
];

const TOP_VARIETIES = [
  { name: 'Royal Delicious', nameHi: 'रॉयल डेलिशस', altitude: '6000–9000ft', votes: 847, rating: 4.7, color: '#dc2626', tag: '#1 Most Grown' },
  { name: 'Scarlet Spur', nameHi: 'स्कार्लेट स्पर', altitude: '6500–8500ft', votes: 621, rating: 4.5, color: '#b91c1c', tag: 'Best Price' },
  { name: 'Fuji', nameHi: 'फूजी', altitude: '5500–7500ft', votes: 589, rating: 4.6, color: '#f59e0b', tag: 'High Yield' },
  { name: 'Jeromine (Galaxy)', nameHi: 'जेरोमिन', altitude: '7000–9500ft', votes: 412, rating: 4.4, color: '#7c3aed', tag: 'Trending ↑' },
  { name: 'Golden Delicious', nameHi: 'गोल्डन डेलिशस', altitude: '5500–8000ft', votes: 374, rating: 4.2, color: '#d97706', tag: 'Export Quality' },
  { name: 'Granny Smith', nameHi: 'ग्रैनी स्मिथ', altitude: '6000–8500ft', votes: 198, rating: 4.0, color: '#16a34a', tag: 'Processing' },
];

const TOP_ROOTSTOCKS = [
  { name: 'M-9', nameHi: 'एम-9', type: 'Dwarfing', spacing: '1.5 × 3 m', votes: 723, rating: 4.8, color: '#2D6A35', tag: 'Best for HP' },
  { name: 'M-7', nameHi: 'एम-7', type: 'Semi-dwarfing', spacing: '3 × 4 m', votes: 612, rating: 4.5, color: '#065f46', tag: 'Most Used' },
  { name: 'EMLA 111', nameHi: 'ईएमएलए 111', type: 'Semi-vigorous', spacing: '4 × 5 m', votes: 389, rating: 4.3, color: '#047857', tag: 'Drought Hardy' },
  { name: 'MM-106', nameHi: 'एमएम-106', type: 'Semi-dwarfing', spacing: '2.5 × 4 m', votes: 354, rating: 4.2, color: '#059669', tag: 'Heavy Soil' },
  { name: 'M-26', nameHi: 'एम-26', type: 'Dwarfing', spacing: '2 × 3 m', votes: 287, rating: 4.4, color: '#10b981', tag: 'Early Bearing' },
];

const TOP_BLOGS = [
  { title: 'Spray Calendar 2026 — Dormancy to Harvest', titleHi: '2026 छिड़काव कैलेंडर', category: 'Spray', catColor: '#0369a1', readMin: 8, views: 2310, author: 'Baagvaani Team', date: 'Feb 28' },
  { title: 'Protect Your Orchard from Late Frost', titleHi: 'देर से पाले से बचाव', category: 'Disease', catColor: '#dc2626', readMin: 4, views: 1240, author: 'Dr. R. Kumar', date: 'Mar 8' },
  { title: 'M-9 Rootstock: Complete HP Farmer Guide', titleHi: 'एम-9 मूलवृंत: पूरी जानकारी', category: 'Rootstock', catColor: '#2D6A35', readMin: 6, views: 987, author: 'S. Chauhan', date: 'Mar 6' },
  { title: 'Woolly Aphid: Identify, Prevent & Treat', titleHi: 'ऊनी माहू: पहचान और रोकथाम', category: 'Pest', catColor: '#7c3aed', readMin: 5, views: 1120, author: 'Dr. M. Sharma', date: 'Mar 1' },
  { title: 'What Affects Mandi Apple Prices?', titleHi: 'मंडी भाव को क्या प्रभावित करता है?', category: 'Market', catColor: '#d97706', readMin: 5, views: 874, author: 'T. Negi', date: 'Mar 4' },
];

const TOP_CONTRIBUTORS = [
  { name: 'Ramesh Negi', nameHi: 'रमेश नेगी', location: 'Kinnaur · 9200ft', initials: 'RN', color: '#2D6A35', points: 847, badge: 'Top Contributor', reports: 34, reviews: 12, photos: 21 },
  { name: 'Sunita Chauhan', nameHi: 'सुनीता चौहान', location: 'Shimla · 6800ft', initials: 'SC', color: '#dc2626', points: 712, badge: 'Disease Reporter', reports: 28, reviews: 19, photos: 8 },
  { name: 'Ajay Thakur', nameHi: 'अजय ठाकुर', location: 'Kullu · 7200ft', initials: 'AT', color: '#d97706', points: 634, badge: 'Spray Expert', reports: 17, reviews: 25, photos: 14 },
  { name: 'Priya Devi', nameHi: 'प्रिया देवी', location: 'Mandi · 5500ft', initials: 'PD', color: '#7c3aed', points: 521, badge: 'Photo Expert', reports: 8, reviews: 11, photos: 43 },
  { name: 'Mohan Verma', nameHi: 'मोहन वर्मा', location: 'Solan · 4800ft', initials: 'MV', color: '#0369a1', points: 489, badge: 'Reviewer', reports: 12, reviews: 31, photos: 6 },
];

// ── Screen ──

export default function HomeScreen(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation<any>();

  const farmerName = user?.name ?? 'Farmer';

  const goToSpray = () => navigation.navigate('Spray');
  const goToWeather = () => navigation.navigate('Discover', { screen: 'Weather' });
  const goToDisease = () => navigation.navigate('Discover', { screen: 'Diseases' });
  const goToVariety = () => navigation.navigate('Discover', { screen: 'VarietyList' });
  const goToRootstock = () => navigation.navigate('Discover', { screen: 'RootstockList' });
  const goToBlog = () => navigation.navigate('Discover', { screen: 'Blog' });

  return (
    <ScreenLayout
      headerProps={{
        farmerName: isAuthenticated ? farmerName.split(' ')[0] : 'Guest',
        location: 'Shimla, HP',
        temperature: '18',
        condition: 'Sunny',
        sprayStatus: 'Safe to spray',
        daysToBloom: 14,
        pendingSprays: 3,
        mandiTrend: '+₹12',
        notificationCount: isAuthenticated ? 3 : 0,
      }}
    >
      {/* Auth prompt for guests */}
      {!isAuthenticated && (
        <AuthPromptBanner
          message="Sign in to unlock personalised spray schedules, weather alerts for your orchard, and exclusive farming input deals."
          messageHi="अपने बाग के लिए व्यक्तिगत स्प्रे शेड्यूल, मौसम अलर्ट और कृषि इनपुट डील के लिए साइन इन करें।"
        />
      )}

      {/* 1. Do Now Banner */}
      <DoNowBanner
        stage={STAGE}
        sprays={SPRAYS}
        diseaseWatch={DISEASE_WATCH}
        soilNutrition={SOIL_NUTRITION}
        weatherWarnings={WEATHER_WARNINGS}
        suitType="perfect"
        suitLabel="Good for Spray"
        suitLabelHi="उचित"
      />

      {/* 2. Forecast Strip */}
      <ForecastStrip forecast={FORECAST} location="Shimla, HP" onViewAll={goToWeather} />

      {/* 3. Weekly Tasks */}
      <WeeklyTasks tasks={TASKS} onViewAll={goToSpray} />

      {/* 4. Alerts */}
      <AlertsSection
        preventiveAlerts={PREVENTIVE_ALERTS}
        outbreakAlerts={OUTBREAK_ALERTS}
        onViewAll={goToDisease}
      />

      {/* 5. Top Varieties */}
      <TopVarieties varieties={TOP_VARIETIES} onViewAll={goToVariety} />

      {/* 6. Top Rootstocks */}
      <TopRootstocks rootstocks={TOP_ROOTSTOCKS} onViewAll={goToRootstock} />

      {/* 7. Top Blogs */}
      <TopBlogs blogs={TOP_BLOGS} onViewAll={goToBlog} />

      {/* 8. Top Contributors */}
      <TopContributors contributors={TOP_CONTRIBUTORS} />

      {/* Bottom spacer */}
      <View style={{ height: 24 }} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({});
