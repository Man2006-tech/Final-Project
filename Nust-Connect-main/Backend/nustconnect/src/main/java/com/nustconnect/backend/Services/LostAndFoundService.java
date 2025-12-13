package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.FoundItem;
import com.nustconnect.backend.Models.LostItem;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.FoundItemRepository;
import com.nustconnect.backend.Repositories.LostItemRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LostAndFoundService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final UserRepository userRepository;

    // ==================== LOST ITEM CRUD ====================
    public LostItem reportLostItem(Long userId, LostItem lostItem) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        lostItem.setReportedBy(user);
        lostItem.setIsFound(false);
        lostItem.setStatus("ACTIVE");

        return lostItemRepository.save(lostItem);
    }

    public LostItem getLostItemById(Long itemId) {
        return lostItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Lost item not found"));
    }

    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAllActiveLostItems();
    }

    public List<LostItem> getLostItemsByUser(Long userId) {
        return lostItemRepository.findByReportedByUserId(userId);
    }

    public List<LostItem> getLostItemsByLocation(String location) {
        return lostItemRepository.findByLocationLostContaining(location);
    }

    public List<LostItem> searchLostItems(String keyword) {
        return lostItemRepository.searchLostItems(keyword);
    }

    public LostItem updateLostItem(Long itemId, LostItem updatedItem) {
        LostItem existingItem = getLostItemById(itemId);

        if (updatedItem.getItemName() != null) {
            existingItem.setItemName(updatedItem.getItemName());
        }
        if (updatedItem.getDescription() != null) {
            existingItem.setDescription(updatedItem.getDescription());
        }
        if (updatedItem.getLocationLost() != null) {
            existingItem.setLocationLost(updatedItem.getLocationLost());
        }
        if (updatedItem.getDateLost() != null) {
            existingItem.setDateLost(updatedItem.getDateLost());
        }
        if (updatedItem.getContactInfo() != null) {
            existingItem.setContactInfo(updatedItem.getContactInfo());
        }
        if (updatedItem.getImageUrl() != null) {
            existingItem.setImageUrl(updatedItem.getImageUrl());
        }

        return lostItemRepository.save(existingItem);
    }

    public LostItem markLostItemAsFound(Long itemId) {
        LostItem item = getLostItemById(itemId);
        item.markAsFound();
        return lostItemRepository.save(item);
    }

    public LostItem closeLostItem(Long itemId) {
        LostItem item = getLostItemById(itemId);
        item.close();
        return lostItemRepository.save(item);
    }

    public void deleteLostItem(Long itemId) {
        LostItem item = getLostItemById(itemId);
        item.softDelete();
        lostItemRepository.save(item);
    }

    public void hardDeleteLostItem(Long itemId) {
        if (!lostItemRepository.existsById(itemId)) {
            throw new IllegalArgumentException("Lost item not found");
        }
        lostItemRepository.deleteById(itemId);
    }

    // ==================== FOUND ITEM CRUD ====================
    public FoundItem reportFoundItem(Long userId, FoundItem foundItem) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        foundItem.setFoundBy(user);
        foundItem.setIsClaimed(false);
        foundItem.setStatus("ACTIVE");

        return foundItemRepository.save(foundItem);
    }

    public FoundItem getFoundItemById(Long itemId) {
        return foundItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Found item not found"));
    }

    public List<FoundItem> getAllFoundItems() {
        return foundItemRepository.findAllActiveFoundItems();
    }

    public List<FoundItem> getFoundItemsByUser(Long userId) {
        return foundItemRepository.findByFoundByUserId(userId);
    }

    public List<FoundItem> getFoundItemsByLocation(String location) {
        return foundItemRepository.findByLocationFoundContaining(location);
    }

    public List<FoundItem> searchFoundItems(String keyword) {
        return foundItemRepository.searchFoundItems(keyword);
    }

    public FoundItem updateFoundItem(Long itemId, FoundItem updatedItem) {
        FoundItem existingItem = getFoundItemById(itemId);

        if (updatedItem.getItemName() != null) {
            existingItem.setItemName(updatedItem.getItemName());
        }
        if (updatedItem.getDescription() != null) {
            existingItem.setDescription(updatedItem.getDescription());
        }
        if (updatedItem.getLocationFound() != null) {
            existingItem.setLocationFound(updatedItem.getLocationFound());
        }
        if (updatedItem.getDateFound() != null) {
            existingItem.setDateFound(updatedItem.getDateFound());
        }
        if (updatedItem.getContactInfo() != null) {
            existingItem.setContactInfo(updatedItem.getContactInfo());
        }
        if (updatedItem.getImageUrl() != null) {
            existingItem.setImageUrl(updatedItem.getImageUrl());
        }

        return foundItemRepository.save(existingItem);
    }

    public FoundItem markFoundItemAsClaimed(Long itemId, Long claimerId) {
        FoundItem item = getFoundItemById(itemId);
        User claimer = userRepository.findById(claimerId)
                .orElseThrow(() -> new IllegalArgumentException("Claimer not found"));

        item.markAsClaimed(claimer);
        return foundItemRepository.save(item);
    }

    public FoundItem closeFoundItem(Long itemId) {
        FoundItem item = getFoundItemById(itemId);
        item.close();
        return foundItemRepository.save(item);
    }

    public void deleteFoundItem(Long itemId) {
        FoundItem item = getFoundItemById(itemId);
        item.softDelete();
        foundItemRepository.save(item);
    }

    public void hardDeleteFoundItem(Long itemId) {
        if (!foundItemRepository.existsById(itemId)) {
            throw new IllegalArgumentException("Found item not found");
        }
        foundItemRepository.deleteById(itemId);
    }

    // ==================== VALIDATION ====================
    public boolean isLostItemOwner(Long itemId, Long userId) {
        LostItem item = getLostItemById(itemId);
        return item.getReportedBy().getUserId().equals(userId);
    }

    public boolean isFoundItemOwner(Long itemId, Long userId) {
        FoundItem item = getFoundItemById(itemId);
        return item.getFoundBy().getUserId().equals(userId);
    }

    public boolean isLostItemFound(Long itemId) {
        LostItem item = getLostItemById(itemId);
        return item.getIsFound();
    }

    public boolean isFoundItemClaimed(Long itemId) {
        FoundItem item = getFoundItemById(itemId);
        return item.getIsClaimed();
    }

    // ==================== STATISTICS ====================
    public long getTotalLostItemCount() {
        return lostItemRepository.count();
    }

    public long getTotalFoundItemCount() {
        return foundItemRepository.count();
    }

    public long getActiveLostItemCount() {
        return lostItemRepository.findAllActiveLostItems().size();
    }

    public long getActiveFoundItemCount() {
        return foundItemRepository.findAllActiveFoundItems().size();
    }

    public long getUserLostItemCount(Long userId) {
        return lostItemRepository.findByReportedByUserId(userId).size();
    }

    public long getUserFoundItemCount(Long userId) {
        return foundItemRepository.findByFoundByUserId(userId).size();
    }

    // ==================== MATCHING ====================
    public List<FoundItem> findPotentialMatches(Long lostItemId) {
        LostItem lostItem = getLostItemById(lostItemId);

        // Search for found items with similar names/descriptions
        return searchFoundItems(lostItem.getItemName());
    }

    public List<LostItem> findPotentialMatchesForFound(Long foundItemId) {
        FoundItem foundItem = getFoundItemById(foundItemId);

        // Search for lost items with similar names/descriptions
        return searchLostItems(foundItem.getItemName());
    }
}