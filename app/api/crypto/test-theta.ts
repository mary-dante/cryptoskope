async function testThetaTokens() {
  try {
    // Test fetching Theta ecosystem tokens
    console.log('Fetching Theta ecosystem tokens...');
    const response = await fetch('http://localhost:3000/api/crypto');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.status} ${response.statusText}`);
    }

    const tokens = await response.json();
    
    console.log('\nFound Theta ecosystem tokens:');
    console.log('------------------------');
    tokens.forEach((token: any) => {
      console.log(`- ${token.name} (${token.symbol.toUpperCase()})`);
      console.log(`  Price: $${token.current_price}`);
      console.log(`  Market Cap: $${token.market_cap}`);
      console.log(`  ID: ${token.id}`);
      console.log('------------------------');
    });

    // Test OHLC data for the first token
    if (tokens.length > 0) {
      const firstToken = tokens[0];
      console.log(`\nTesting OHLC data for ${firstToken.name}...`);
      
      const ohlcResponse = await fetch(`http://localhost:3000/api/crypto/ohlc?id=${firstToken.id}&days=7`);
      
      if (!ohlcResponse.ok) {
        throw new Error(`Failed to fetch OHLC data: ${ohlcResponse.status} ${ohlcResponse.statusText}`);
      }

      const ohlcData = await ohlcResponse.json();
      console.log(`Successfully retrieved ${ohlcData.length} OHLC data points for ${firstToken.name}`);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testThetaTokens(); 