import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Banner, Text } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { hebrewTextStyle } from '@/styles/theme';

interface NetworkStatusProps {
  showOnlineStatus?: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  showOnlineStatus = false,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? false;
      
      // Show banner when going offline or if showOnlineStatus is true
      if (!connected || (connected && showOnlineStatus && isConnected === false)) {
        setShowBanner(true);
        
        // Auto-hide online banner after 3 seconds
        if (connected && showOnlineStatus) {
          setTimeout(() => setShowBanner(false), 3000);
        }
      } else if (connected && !showOnlineStatus) {
        setShowBanner(false);
      }
      
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, [isConnected, showOnlineStatus]);

  if (!showBanner || isConnected === null) {
    return null;
  }

  return (
    <Banner
      visible={showBanner}
      actions={isConnected ? [] : [
        {
          label: 'הבנתי',
          onPress: () => setShowBanner(false),
        },
      ]}
      icon={isConnected ? 'wifi' : 'wifi-off'}
      style={[
        styles.banner,
        isConnected ? styles.onlineBanner : styles.offlineBanner
      ]}
    >
      <Text style={hebrewTextStyle}>
        {isConnected 
          ? 'חזרת להיות מחובר לאינטרנט'
          : 'אין חיבור לאינטרנט. הנתונים יישמרו מקומית ויסונכרנו כשהחיבור יחזור.'
        }
      </Text>
    </Banner>
  );
};

const styles = StyleSheet.create({
  banner: {
    elevation: 4,
  },
  onlineBanner: {
    backgroundColor: '#E8F5E8',
  },
  offlineBanner: {
    backgroundColor: '#FFF3E0',
  },
});

export default NetworkStatus;