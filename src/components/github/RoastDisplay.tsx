'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, GitCommit, Share, RotateCcw } from 'lucide-react';
import { RoastResult } from '@/types/github';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRoasting } from '@/hooks/useRoasting';

interface RoastDisplayProps {
  result: RoastResult;
  username: string;
  onReset: () => void;
}

export const RoastDisplay: React.FC<RoastDisplayProps> = ({ 
  result, 
  username, 
  onReset 
}) => {
  const { getRoastSeverity } = useRoasting();
  const severity = getRoastSeverity(result.score);

  const handleShare = async () => {
    const shareText = `Just got roasted by Roastivator! 🔥\n\nUsername: ${username}\nScore: ${result.score}/10 (${severity})\n\n"${result.overallRoast}"\n\nCheck your GitHub sins: ${window.location.href}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My GitHub Roast Results',
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const severityConfig = {
    mild: { color: 'text-green-400', bgColor: 'from-green-600/20', emoji: '😊' },
    medium: { color: 'text-yellow-400', bgColor: 'from-yellow-600/20', emoji: '😬' },
    spicy: { color: 'text-orange-400', bgColor: 'from-orange-600/20', emoji: '🌶️' },
    nuclear: { color: 'text-red-400', bgColor: 'from-red-600/20', emoji: '☢️' },
  };

  const config = severityConfig[severity];

  return (
    <motion.div
      className="space-y-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header with score */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-2">
            Roast Complete!
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-gray-300">Roast Score:</span>
            <motion.span 
              className={`text-3xl font-bold ${config.color}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {result.score}/10
            </motion.span>
            <span className="text-2xl">{config.emoji}</span>
          </div>
          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${config.bgColor} to-transparent border border-gray-600`}>
            <span className={`font-semibold ${config.color} capitalize`}>
              {severity} Roast
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main roast */}
      <Card variant="elevated" animated>
        <CardHeader 
          icon={Flame} 
          title="The Main Event"
          subtitle={`Analyzing @${username}`}
        />
        <CardContent>
          <motion.p 
            className="text-lg text-gray-200 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {result.overallRoast}
          </motion.p>
        </CardContent>
      </Card>

      {/* Commit message roasts */}
      {result.commitMessageRoasts.length > 0 && (
        <Card variant="default" animated>
          <CardHeader 
            icon={GitCommit} 
            title="Commit Message Hall of Shame"
            subtitle={`Found ${result.commitMessageRoasts.length} infractions`}
          />
          <CardContent>
            <div className="space-y-3">
              {result.commitMessageRoasts.map((roast, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-red-500"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-gray-300">{roast}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repository roasts */}
      {result.repositoryRoasts.length > 0 && (
        <Card variant="default" animated>
          <CardHeader 
            title="Repository Quality Assessment"
            subtitle="Your repos have been judged"
          />
          <CardContent>
            <div className="space-y-3">
              {result.repositoryRoasts.map((roast, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-yellow-500"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-gray-300">{roast}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contribution roasts */}
      {result.contributionRoasts.length > 0 && (
        <Card variant="default" animated>
          <CardHeader 
            title="Contribution Patterns Exposed"
            subtitle="Your activity speaks volumes"
          />
          <CardContent>
            <div className="space-y-3">
              {result.contributionRoasts.map((roast, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-blue-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-gray-300">{roast}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emoji roasts */}
      {result.emojiRoasts.length > 0 && (
        <Card variant="default" animated>
          <CardHeader 
            title="Emoji Crimes Against Humanity"
            subtitle={`${result.metrics.emojiUsagePercentage}% emoji usage detected`}
          />
          <CardContent>
            <div className="space-y-3">
              {result.emojiRoasts.map((roast, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-pink-500"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-gray-300">{roast}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics summary */}
      <Card variant="outline" animated>
        <CardHeader title="Analytics Summary" subtitle="The numbers don't lie" />
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{result.metrics.totalRepos}</div>
              <div className="text-xs text-gray-500">Repositories</div>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{result.metrics.totalCommits}</div>
              <div className="text-xs text-gray-500">Commits Analyzed</div>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{result.metrics.accountAgeYears}</div>
              <div className="text-xs text-gray-500">Years Active</div>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">{result.metrics.emojiUsagePercentage}%</div>
              <div className="text-xs text-gray-500">Emoji Usage</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center space-x-4 w-full">
            <Button
              onClick={onReset}
              variant="ghost"
              icon={RotateCcw}
              iconPosition="left"
              animated
            >
              Roast Another Victim
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              icon={Share}
              iconPosition="left"
              animated
            >
              Share the Pain
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};